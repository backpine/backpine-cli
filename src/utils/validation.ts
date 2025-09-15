import validateNpmPackageName from 'validate-npm-package-name';
import fs from 'fs-extra';
import path from 'path';

export function validateProjectName(name: string): { valid: boolean; errors: string[] } {
  // Special case: allow "." for current directory
  if (name === '.') {
    return { valid: true, errors: [] };
  }

  const result = validateNpmPackageName(name);
  const errors: string[] = [];

  if (!result.validForNewPackages) {
    if (result.errors) {
      errors.push(...result.errors);
    }
    if (result.warnings) {
      errors.push(...result.warnings);
    }
  }

  // Additional checks
  if (name.length === 0) {
    errors.push('Project name cannot be empty');
  }

  if (name.includes(' ')) {
    errors.push('Project name cannot contain spaces');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function checkDirectoryExists(targetPath: string): Promise<boolean> {
  return await fs.pathExists(targetPath);
}

export async function isDirectoryEmpty(targetPath: string): Promise<boolean> {
  if (!(await fs.pathExists(targetPath))) {
    return true;
  }

  const files = await fs.readdir(targetPath);
  return files.length === 0;
}