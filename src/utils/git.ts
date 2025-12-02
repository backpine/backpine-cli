import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs-extra';
import { Template } from '../types/index.js';

export async function cloneRepository(template: Template, targetDir: string): Promise<void> {
  const git = simpleGit();
  
  // If cloning to current directory, use a temp directory first
  const isCurrentDir = targetDir === process.cwd();
  const cloneTarget = isCurrentDir ? path.join(targetDir, '.temp-clone') : targetDir;
  
  // Clone the repository
  await git.clone(template.repo, cloneTarget, {
    '--branch': template.branch || 'main',
    '--single-branch': null,
    '--depth': '1'
  });

  // Remove .git from cloned repo to make it repoless
  const clonedGitDir = path.join(cloneTarget, '.git');
  if (await fs.pathExists(clonedGitDir)) {
    await fs.remove(clonedGitDir);
  }

  // If we cloned to a temp directory, move contents to current directory
  if (isCurrentDir) {
    const tempContents = await fs.readdir(cloneTarget);
    for (const item of tempContents) {
      const srcPath = path.join(cloneTarget, item);
      const destPath = path.join(targetDir, item);
      await fs.move(srcPath, destPath, { overwrite: true });
    }
    // Remove the temp directory
    await fs.remove(cloneTarget);
  }
}