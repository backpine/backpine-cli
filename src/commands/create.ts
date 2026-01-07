import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import { CreateOptions, Template } from "../types/index.js";
import { templates, getTemplate } from "../templates.js";
import {
  validateProjectName,
  checkDirectoryExists,
  isDirectoryEmpty,
} from "../utils/validation.js";
import { cloneRepository } from "../utils/git.js";

export async function createProject(
  templateName: string,
  options: CreateOptions = {},
): Promise<void> {
  try {
    // Step 1: Validate template exists
    const selectedTemplate = getTemplate(templateName);
    if (!selectedTemplate) {
      console.log(chalk.red(`Template "${templateName}" not found`));
      console.log(chalk.gray("Available templates:"));
      templates.forEach((t) => console.log(chalk.gray(`  - ${t.name}`)));
      process.exit(1);
    }

    // Step 2: Determine target directory
    const projectName = options.name;
    const targetDir = projectName ? path.resolve(projectName) : process.cwd();

    // Step 3: Validate project name if provided
    if (projectName) {
      const nameValidation = validateProjectName(projectName);
      if (!nameValidation.valid) {
        console.log(
          chalk.red(
            `Invalid project name: ${nameValidation.errors.join(", ")}`,
          ),
        );
        process.exit(1);
      }
    }

    // Step 4: Check target directory
    const dirExists = await checkDirectoryExists(targetDir);
    if (dirExists && !projectName) {
      // Creating in current directory - check if it's empty
      const isEmpty = await isDirectoryEmpty(targetDir);
      if (!isEmpty) {
        console.log(
          chalk.yellow(
            "Current directory is not empty. This will add template files to the existing directory.",
          ),
        );
      }
    } else if (dirExists && projectName) {
      // Creating in new directory that already exists
      console.log(chalk.red(`Directory "${projectName}" already exists`));
      process.exit(1);
    }

    // Step 5: Clone and setup project
    const locationMessage = projectName
      ? `Creating project "${projectName}" from template "${selectedTemplate.name}"`
      : `Creating project in current directory from template "${selectedTemplate.name}"`;

    console.log(chalk.blue(`\n🚀 ${locationMessage}\n`));

    const spinner = ora("Cloning template repository...").start();

    try {
      await cloneRepository(selectedTemplate, targetDir);
      spinner.succeed("Template cloned successfully (repoless)");

      // Step 6: Update package.json and wrangler.jsonc if it exists and project name was provided
      if (projectName) {
        const packageJsonPath = path.join(targetDir, "package.json");
        if (await fs.pathExists(packageJsonPath)) {
          spinner.start("Updating package.json...");
          const packageJson = await fs.readJson(packageJsonPath);
          packageJson.name = projectName;
          await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
          spinner.succeed("Package.json updated with new project name");
        }

        const wranglerJsoncPath = path.join(targetDir, "apps", "user-application", "wrangler.jsonc");
        if (await fs.pathExists(wranglerJsoncPath)) {
          spinner.start("Updating wrangler.jsonc...");
          // maybe replace with a jsonc parser in the future? like jsonc-parser
          let wranglerJsonc = await fs.readFile(wranglerJsoncPath, "utf-8");
          wranglerJsonc = wranglerJsonc.replace(
            /"name":\s*".*"/,
            `"name": "${projectName}"`,
          );
          await fs.writeFile(wranglerJsoncPath, wranglerJsonc, "utf-8");
          spinner.succeed("wrangler.jsonc updated with new project name");
        }
      }

      const successMessage = projectName
        ? `\n✅ Successfully created project "${projectName}"!`
        : `\n✅ Successfully created project in current directory!`;

      console.log(chalk.green.bold(successMessage));
    } catch (error) {
      spinner.fail("Failed to create project");
      console.error(
        chalk.red("Error:"),
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  } catch (error) {
    console.error(
      chalk.red("An unexpected error occurred:"),
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}
