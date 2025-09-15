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

export async function cleanGitHistory(targetDir: string): Promise<void> {
  const gitDir = path.join(targetDir, '.git');
  
  if (await fs.pathExists(gitDir)) {
    await fs.remove(gitDir);
  }
}

export async function initializeGit(targetDir: string): Promise<void> {
  const git = simpleGit(targetDir);
  await git.init();
  await git.add('.');
  await git.commit('Initial commit from backpine-cli');
}