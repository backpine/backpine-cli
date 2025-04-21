import * as fs from "fs/promises";
import * as path from "path";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import https from "https";

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
  "node_modules",
  ".wrangler",
  "dist",
  ".git",
  ".DS_Store",
  "npm-debug.log",
  "yarn-error.log",
  ".env",
  ".env.local",
  ".env.development.local",
  ".env.test.local",
  ".env.production.local",
];

/**
 * Check if a path should be ignored based on ignore patterns
 * @param filePath Path to check
 * @param ignorePatterns Array of glob patterns to ignore
 */
export function shouldIgnorePath(
  filePath: string,
  ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS,
): boolean {
  const basename = path.basename(filePath);
  return ignorePatterns.some((pattern) => {
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
  ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS,
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
export async function updateJsonFile(
  filePath: string,
  updates: Record<string, any>,
): Promise<void> {
  try {
    // Read the JSON file
    const content = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(content);

    // Apply updates
    const updatedJson = { ...json, ...updates };

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(updatedJson, null, 2), "utf-8");

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
export async function updateJsoncFile(
  filePath: string,
  updates: Record<string, any>,
): Promise<void> {
  try {
    // Read the JSONC file
    let content = await fs.readFile(filePath, "utf-8");

    // Better comment handling - remove block comments first, then line comments
    const contentWithoutBlockComments = content.replace(
      /\/\*[\s\S]*?\*\//g,
      "",
    );
    const contentWithoutComments = contentWithoutBlockComments.replace(
      /\/\/.*$/gm,
      "",
    );

    // Parse the JSON
    const json = JSON.parse(contentWithoutComments);

    // Apply updates directly to the JSON object
    for (const [key, value] of Object.entries(updates)) {
      json[key] = value;
    }

    // Write back to file - we'll just write the updated JSON
    // This loses comments, but prevents JSON parsing errors
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8");

    logSuccess(`Updated ${path.basename(filePath)}`);
  } catch (error) {
    // If file doesn't exist or isn't valid JSONC, log a warning but don't fail
    logWarning(`Could not update ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Fetch JSON data from a URL
 */
export async function fetchJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent": "backpine-cli",
            Accept: "application/vnd.github.v3+json",
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            try {
              const jsonData = JSON.parse(data);
              if (res.statusCode !== 200) {
                reject(
                  new Error(
                    `GitHub API error: ${jsonData.message || "Unknown error"}`,
                  ),
                );
                return;
              }
              resolve(jsonData);
            } catch (e) {
              reject(e);
            }
          });
        },
      )
      .on("error", (err) => {
        reject(err);
      });
  });
}

/**
 * List available templates from GitHub
 */
export async function listGitHubTemplates(): Promise<string[]> {
  try {
    // Fetch contents of the templates directory
    const repoUrl =
      "https://api.github.com/repos/backpine/backpine-cli/contents/templates";
    const contents = await fetchJson(repoUrl);

    // Filter for directories only
    return contents
      .filter((item: any) => item.type === "dir")
      .map((item: any) => item.name);
  } catch (error) {
    logWarning(`Failed to fetch GitHub templates: ${(error as Error).message}`);
    return [];
  }
}

/**
 * Download a file from GitHub
 */
async function downloadFile(url: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Handle redirects
          if (response.headers.location) {
            downloadFile(response.headers.location, destination)
              .then(resolve)
              .catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        const fileStream = createWriteStream(destination);
        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          resolve();
        });

        fileStream.on("error", (err) => {
          fs.unlink(destination).catch(() => {});
          reject(err);
        });
      })
      .on("error", reject);
  });
}

/**
 * Download a directory from GitHub recursively
 */
export async function downloadGitHubRepo(
  owner: string,
  repo: string,
  path: string,
  destination: string,
  ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS,
): Promise<void> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const contents = await fetchJson(url);

  if (!Array.isArray(contents)) {
    throw new Error("Expected directory contents but got a file");
  }

  await fs.mkdir(destination, { recursive: true });

  for (const item of contents) {
    const destPath = `${destination}/${item.name}`;

    // Skip ignored patterns
    if (shouldIgnorePath(destPath, ignorePatterns)) {
      continue;
    }

    if (item.type === "dir") {
      // Recursively download subdirectory
      await downloadGitHubRepo(
        owner,
        repo,
        item.path,
        destPath,
        ignorePatterns,
      );
    } else if (item.type === "file") {
      // Download file
      await downloadFile(item.download_url, destPath);
    }
  }
}
