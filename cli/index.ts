#!/usr/bin/env node

import { Command } from "commander";
import { listTemplates, createProjectFromTemplate } from "./templateManager.js";
import { logSuccess, logError } from "./utils.js";
import inquirer from "inquirer";

const program = new Command();

program
  .name("backpinet")
  .description("CLI tool to create projects from templates")
  .version("1.0.1");

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

program
  .command("template")
  .description("Interactive template selection and project creation")
  .option("-d, --directory <dir>", "Directory to create the project in", "./")
  .action(async (options: { directory: string }) => {
    try {
      const templates = await listTemplates();

      // Combine all templates into a single array for selection
      const allTemplates = [
        ...templates.local.map((t) => ({ name: t, source: "local" })),
        ...templates.github.map((t) => ({ name: t, source: "github" })),
      ];

      if (allTemplates.length === 0) {
        console.log("No templates found");
        return;
      }

      // Prompt user to select a template
      const { selectedTemplate } = await inquirer.prompt([
        {
          type: "list",
          name: "selectedTemplate",
          message: "Select a template:",
          choices: allTemplates.map((t) => `${t.name} (${t.source})`),
        },
      ]);

      // Extract the template name from the selection
      const templateName = selectedTemplate.split(" ")[0];

      // Prompt for project name
      const { projectName } = await inquirer.prompt([
        {
          type: "input",
          name: "projectName",
          message: "Enter project name:",
          validate: (input) =>
            input.trim() !== "" || "Project name is required",
        },
      ]);

      // Create the project
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
  });

program.parse(process.argv);
