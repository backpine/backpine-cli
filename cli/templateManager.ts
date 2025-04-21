import * as fs from "fs/promises";
import * as path from "path";
import {
  fileExists,
  logInfo,
  logSuccess,
  updateJsonFile,
  DEFAULT_IGNORE_PATTERNS,
  downloadGitHubRepo,
  listGitHubTemplates,
} from "./utils.js";

/**
 * List all available templates (from GitHub)
 */
export async function listTemplates(): Promise<{
  local: string[];
  github: string[];
}> {
  const githubTemplates = await listGitHubTemplates();

  return {
    local: [], // No more local templates
    github: githubTemplates,
  };
}

/**
 * Check if a template exists on GitHub
 */
async function templateExists(
  templateName: string,
): Promise<{ exists: boolean; source: "github" }> {
  // Check if it's a GitHub template
  const githubTemplates = await listGitHubTemplates();
  if (githubTemplates.includes(templateName)) {
    return { exists: true, source: "github" };
  }

  return { exists: false, source: "github" };
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
  const template = await templateExists(templateName);
  if (!template.exists) {
    throw new Error(`Template '${templateName}' not found on GitHub`);
  }

  // Create project directory path
  const projectPath = path.join(targetDir, projectName);

  // Check if project directory already exists
  if (await fileExists(projectPath)) {
    throw new Error(`Directory '${projectPath}' already exists`);
  }

  // Create project directory
  await fs.mkdir(projectPath, { recursive: true });

  // Download from GitHub
  logInfo(
    `Downloading GitHub template '${templateName}' to '${projectPath}'...`,
  );
  await downloadGitHubRepo(
    "backpine",
    "backpine-cli",
    `templates/${templateName}`,
    projectPath,
  );

  // Update package.json with project name if it exists
  const packageJsonPath = path.join(projectPath, "package.json");
  if (await fileExists(packageJsonPath)) {
    await updateJsonFile(packageJsonPath, { name: projectName });
  }

  // Update wrangler.jsonc with project name if it exists
  const wranglerJsoncPath = path.join(projectPath, "wrangler.jsonc");
  if (await fileExists(wranglerJsoncPath)) {
    try {
      const wranglerContent = await fs.readFile(wranglerJsoncPath, "utf-8");
      const updatedContent = wranglerContent.replace(
        /<PROJECT_NAME>/g,
        projectName,
      );

      // Check if any replacements were actually made
      if (wranglerContent === updatedContent) {
        logInfo("No '<PROJECT_NAME>' placeholders found in wrangler.jsonc");
      } else {
        await fs.writeFile(wranglerJsoncPath, updatedContent);
        logInfo(`Updated wrangler.jsonc with project name: ${projectName}`);
      }
    } catch (error) {
      // Throw error instead of just logging
      throw new Error(
        `Failed to update project name in wrangler.jsonc: ${(error as Error).message}`,
      );
    }
  }

  // Log success message
  logSuccess(`Project ${projectName} created successfully`);
}
