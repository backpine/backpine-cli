import * as fs from "fs/promises";
import { accessSync } from "fs";

import * as path from "path";
import { fileURLToPath } from "url";
import {
  fileExists,
  copyDirectory,
  logInfo,
  logSuccess,
  updateJsonFile,
  updateJsoncFile,
  DEFAULT_IGNORE_PATTERNS,
} from "./utils.js";

/**
 * Get the absolute path to the templates directory
 */
function getTemplatesDir(): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Try different possible locations for templates
  const possiblePaths = [
    path.resolve(__dirname, "../templates"), // when running from dist
    path.resolve(__dirname, "../../templates"), // when running from project root
    path.resolve(process.cwd(), "templates"), // fallback to current working directory
  ];

  for (const templatePath of possiblePaths) {
    try {
      accessSync(templatePath);
      return templatePath;
    } catch (error) {
      // Path doesn't exist, try next one
    }
  }

  // If we get here, we couldn't find templates
  throw new Error(
    "Templates directory not found. Make sure it exists in the package.",
  );
}

/**
 * List all available templates
 */
export async function listTemplates(): Promise<string[]> {
  const templatesDir = getTemplatesDir();
  const templates = await fs.readdir(templatesDir);
  const filteredTemplates = [];

  for (const template of templates) {
    const stats = await fs.stat(path.join(templatesDir, template));
    if (stats.isDirectory()) {
      filteredTemplates.push(template);
    }
  }

  return filteredTemplates;
}

/**
 * Check if a template exists
 */
async function templateExists(templateName: string): Promise<boolean> {
  const templatePath = path.join(getTemplatesDir(), templateName);
  return fileExists(templatePath);
}

/**
 * Create a new project from a template
 */
export async function createProjectFromTemplate(
  templateName: string,
  projectName: string,
  targetDir: string = "./",
  ignorePatterns: string[] = DEFAULT_IGNORE_PATTERNS,
): Promise<void> {
  // Check if template exists
  if (!(await templateExists(templateName))) {
    throw new Error(`Template '${templateName}' not found`);
  }

  // Create project directory path
  const projectPath = path.join(targetDir, projectName);

  // Check if project directory already exists
  if (await fileExists(projectPath)) {
    throw new Error(`Directory '${projectPath}' already exists`);
  }

  // Create project directory
  await fs.mkdir(projectPath, { recursive: true });

  // Copy template to project directory with ignore patterns
  const templatePath = path.join(getTemplatesDir(), templateName);
  logInfo(`Copying template '${templateName}' to '${projectPath}'...`);
  await copyDirectory(templatePath, projectPath, ignorePatterns);

  // Update package.json with project name if it exists
  const packageJsonPath = path.join(projectPath, "package.json");
  if (await fileExists(packageJsonPath)) {
    await updateJsonFile(packageJsonPath, { name: projectName });
  }

  // Update wrangler.jsonc with project name if it exists
  const wranglerJsoncPath = path.join(projectPath, "wrangler.jsonc");
  if (await fileExists(wranglerJsoncPath)) {
    await updateJsoncFile(wranglerJsoncPath, { name: projectName });
  }

  // Log success message
  logSuccess(`Project ${projectName} created successfully`);
}
