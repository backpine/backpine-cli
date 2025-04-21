#!/usr/bin/env node

import { Command } from "commander";
import { listTemplates, createProjectFromTemplate } from "./templateManager.js";
import { logSuccess, logError } from "./utils.js";

const program = new Command();

program
  .name("backpinet")
  .description("CLI tool to create projects from templates")
  .version("0.0.4");

program
  .command("list")
  .description("List all available templates")
  .action(async () => {
    try {
      const templates = await listTemplates();

      if (templates.local.length > 0) {
        console.log("Available local templates:");
        templates.local.forEach((template: string) =>
          console.log(`- ${template}`),
        );
      }

      if (templates.github.length > 0) {
        console.log("\nAvailable GitHub templates:");
        templates.github.forEach((template: string) =>
          console.log(`- ${template}`),
        );
      }

      if (templates.local.length === 0 && templates.github.length === 0) {
        console.log("No templates found");
      }
    } catch (error: unknown) {
      logError(
        `Failed to list templates: ${error instanceof Error ? error.message : String(error)}`,
      );
      process.exit(1);
    }
  });

program
  .command("create")
  .description("Create a new project from a template")
  .argument("<template-name>", "Name of the template to use")
  .argument("<project-name>", "Name of the project to create")
  .option("-d, --directory <dir>", "Directory to create the project in", "./")
  .action(
    async (
      templateName: string,
      projectName: string,
      options: { directory: string },
    ) => {
      try {
        await createProjectFromTemplate(
          templateName,
          projectName,
          options.directory,
        );
        logSuccess(
          `Project '${projectName}' created successfully from template '${templateName}'!`,
        );
      } catch (error: unknown) {
        logError(
          `Failed to create project: ${error instanceof Error ? error.message : String(error)}`,
        );
        process.exit(1);
      }
    },
  );

program.parse(process.argv);
