import * as fs from 'fs/promises';
import * as path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

/**
 * Log a success message
 */
export function logSuccess(message: string): void {
  console.log(`\x1b[32m✓ ${message}\x1b[0m`);
}

/**
 * Log an error message
 */
export function logError(message: string): void {
  console.error(`\x1b[31m✗ ${message}\x1b[0m`);
}

/**
 * Log an info message
 */
export function logInfo(message: string): void {
  console.log(`\x1b[34mℹ ${message}\x1b[0m`);
}

/**
 * Log a warning message
 */
export function logWarning(message: string): void {
  console.warn(`\x1b[33m⚠ ${message}\x1b[0m`);
}

/**
 * Check if a file or directory exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Default ignore patterns for template copying
 */
export const DEFAULT_IGNORE_PATTERNS = [
  'node_modules',
  '.wrangler',
  'dist',
  '.git',
  '.DS_Store',
  'npm-debug.log',
  'yarn-error.log',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.production.local'
];

/**
 * Check if a path should be ignored based on ignore patterns
 * @param filePath Path to check
 * @param ignorePatterns Array of glob patterns to ignore
 */
export function shouldIgnorePath(filePath: string, ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS): boolean {
  const basename = path.basename(filePath);
  return ignorePatterns.some(pattern => {
    // Simple matching for now, could be extended to support glob patterns
    return basename === pattern || filePath.includes(`/${pattern}/`);
  });
}

/**
 * Copy a directory recursively with ignore patterns
 */
export async function copyDirectory(
  source: string, 
  destination: string, 
  ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS
): Promise<void> {
  // Check if path should be ignored
  if (shouldIgnorePath(source, ignorePatterns)) {
    return;
  }

  // Get stats of source directory
  const stats = await fs.stat(source);

  // Create destination directory if it's a directory
  if (stats.isDirectory()) {
    // Create destination directory if it doesn't exist
    await fs.mkdir(destination, { recursive: true });

    // Get contents of source directory
    const entries = await fs.readdir(source);

    // Recursively copy each entry
    for (const entry of entries) {
      const srcPath = path.join(source, entry);
      const destPath = path.join(destination, entry);
      await copyDirectory(srcPath, destPath, ignorePatterns);
    }
  } else {
    // It's a file, so copy it
    await copyFile(source, destination);
  }
}

/**
 * Copy a file
 */
async function copyFile(source: string, destination: string): Promise<void> {
  const src = createReadStream(source);
  const dest = createWriteStream(destination);
  await pipeline(src, dest);
}

/**
 * Update JSON file with specific fields
 */
export async function updateJsonFile(filePath: string, updates: Record<string, any>): Promise<void> {
  try {
    // Read the JSON file
    const content = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(content);
    
    // Apply updates
    const updatedJson = { ...json, ...updates };
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(updatedJson, null, 2), 'utf-8');
    
    logSuccess(`Updated ${path.basename(filePath)}`);
  } catch (error) {
    // If file doesn't exist or isn't valid JSON, log a warning but don't fail
    logWarning(`Could not update ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Update JSONC file (JSON with comments) with specific fields
 * This is a simplified implementation that works for basic JSONC files
 */
export async function updateJsoncFile(filePath: string, updates: Record<string, any>): Promise<void> {
  try {
    // Read the JSONC file
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Very simple comment handling - this could be improved with a proper JSONC parser
    // Remove comments for parsing
    const contentWithoutComments = content.replace(/\/\/.*$/gm, '');
    
    // Parse the JSON
    const json = JSON.parse(contentWithoutComments);
    
    // Apply updates
    const updatedJson = { ...json, ...updates };
    
    // Find each key in the original content and update its value
    // This is a simple approach that preserves comments but might not work for all JSONC files
    for (const [key, value] of Object.entries(updates)) {
      const regex = new RegExp(`("${key}"\s*:\s*)([^,\n}]*)`, 'g');
      const stringValue = JSON.stringify(value);
      content = content.replace(regex, `$1${stringValue}`);
    }
    
    // Write back to file
    await fs.writeFile(filePath, content, 'utf-8');
    
    logSuccess(`Updated ${path.basename(filePath)}`);
  } catch (error) {
    // If file doesn't exist or isn't valid JSONC, log a warning but don't fail
    logWarning(`Could not update ${filePath}: ${(error as Error).message}`);
  }
}