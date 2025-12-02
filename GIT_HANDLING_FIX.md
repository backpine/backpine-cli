# Git Configuration Issue & Solution

## The Problem

When running `backpine create <template>`, the template files should be "repoless" - meaning users can:
1. Add the files to their **existing** git repository
2. Initialize their **own** git repo afterward

Currently, there are two issues in `src/utils/git.ts`:

### Issue 1: Overwriting Existing .git Directory

When cloning to the current directory, the code moves **all** files from the temp clone, including `.git`:

```typescript
// src/utils/git.ts lines 21-29
if (isCurrentDir) {
  const tempContents = await fs.readdir(cloneTarget);
  for (const item of tempContents) {  // <-- This includes .git!
    const srcPath = path.join(cloneTarget, item);
    const destPath = path.join(targetDir, item);
    await fs.move(srcPath, destPath, { overwrite: true });  // <-- Overwrites existing .git
  }
  await fs.remove(cloneTarget);
}
```

If a user runs the command in an existing repo, their `.git` folder gets overwritten before `cleanGitHistory` can preserve it.

### Issue 2: Auto-Initializing a New Git Repo

The `initializeGit()` function always creates a new repo with an initial commit:

```typescript
// src/utils/git.ts lines 41-46
export async function initializeGit(targetDir: string): Promise<void> {
  const git = simpleGit(targetDir);
  await git.init();
  await git.add('.');
  await git.commit('Initial commit from backpine-cli');
}
```

This forces a new repo structure instead of letting users manage their own git workflow.

---

## The Solution

### Option A: Make It Fully Repoless (Recommended)

Remove all git initialization and just provide clean files:

**1. Fix `cloneRepository` to skip `.git` when moving files:**

```typescript
export async function cloneRepository(template: Template, targetDir: string): Promise<void> {
  const git = simpleGit();

  const isCurrentDir = targetDir === process.cwd();
  const cloneTarget = isCurrentDir ? path.join(targetDir, '.temp-clone') : targetDir;

  await git.clone(template.repo, cloneTarget, {
    '--branch': template.branch || 'main',
    '--single-branch': null,
    '--depth': '1'
  });

  // Remove .git from cloned repo BEFORE moving files
  const clonedGitDir = path.join(cloneTarget, '.git');
  if (await fs.pathExists(clonedGitDir)) {
    await fs.remove(clonedGitDir);
  }

  if (isCurrentDir) {
    const tempContents = await fs.readdir(cloneTarget);
    for (const item of tempContents) {
      // .git is already removed, so this is safe
      const srcPath = path.join(cloneTarget, item);
      const destPath = path.join(targetDir, item);
      await fs.move(srcPath, destPath, { overwrite: true });
    }
    await fs.remove(cloneTarget);
  }
}
```

**2. Remove `cleanGitHistory` and `initializeGit` calls from `create.ts`:**

```typescript
// In src/commands/create.ts, remove lines 80-86:
// spinner.start("Cleaning up git history...");
// await cleanGitHistory(targetDir);
// spinner.succeed("Git history cleaned");

// spinner.start("Initializing new git repository...");
// await initializeGit(targetDir);
// spinner.succeed("New git repository initialized");
```

**Result:** Users get clean template files with no `.git` directory. They can:
- `git init` themselves if they want a new repo
- Add files to an existing repo if they're already in one

---

### Option B: Add a `--no-git` Flag

Keep current behavior but add an option for repoless mode:

**1. Add option in `src/index.ts`:**

```typescript
program
  .command("create <template-name>")
  .description("Create a new project from a template")
  .option("-n, --name <name>", "Project directory name")
  .option("--no-git", "Skip git initialization (repoless mode)")
  .action(async (templateName, options) => {
    await createProject(templateName, options);
  });
```

**2. Update `CreateOptions` type:**

```typescript
export interface CreateOptions {
  name?: string;
  git?: boolean;  // Will be false when --no-git is used
}
```

**3. Conditionally run git operations in `create.ts`:**

```typescript
if (options.git !== false) {
  spinner.start("Cleaning up git history...");
  await cleanGitHistory(targetDir);
  spinner.succeed("Git history cleaned");

  spinner.start("Initializing new git repository...");
  await initializeGit(targetDir);
  spinner.succeed("New git repository initialized");
} else {
  // Just remove the template's .git without initializing new one
  spinner.start("Removing template git configuration...");
  await cleanGitHistory(targetDir);
  spinner.succeed("Template is now repoless");
}
```

---

### Option C: Smart Detection (Most User-Friendly)

Automatically detect if user is in an existing git repo and preserve it:

```typescript
export async function cloneRepository(template: Template, targetDir: string): Promise<void> {
  const git = simpleGit();

  const isCurrentDir = targetDir === process.cwd();
  const cloneTarget = isCurrentDir ? path.join(targetDir, '.temp-clone') : targetDir;

  // Check if target already has a git repo BEFORE cloning
  const existingGitDir = path.join(targetDir, '.git');
  const hasExistingRepo = await fs.pathExists(existingGitDir);

  await git.clone(template.repo, cloneTarget, {
    '--branch': template.branch || 'main',
    '--single-branch': null,
    '--depth': '1'
  });

  // Always remove template's .git
  const clonedGitDir = path.join(cloneTarget, '.git');
  await fs.remove(clonedGitDir);

  if (isCurrentDir) {
    const tempContents = await fs.readdir(cloneTarget);
    for (const item of tempContents) {
      const srcPath = path.join(cloneTarget, item);
      const destPath = path.join(targetDir, item);
      await fs.move(srcPath, destPath, { overwrite: true });
    }
    await fs.remove(cloneTarget);
  }

  return hasExistingRepo;  // Return this to skip git init if true
}
```

---

## Recommendation

**Go with Option A (Fully Repoless)** for simplicity. Most template CLIs (like `degit`) follow this pattern:

1. Download template files
2. Remove template's `.git`
3. Let users handle their own git workflow

This gives users full control and avoids any unexpected git behavior.

## Files to Modify

| File | Changes |
|------|---------|
| `src/utils/git.ts` | Remove `.git` in `cloneRepository` before moving files |
| `src/commands/create.ts` | Remove `cleanGitHistory` and `initializeGit` calls |
| `src/utils/git.ts` | Can delete `cleanGitHistory` and `initializeGit` functions if going fully repoless |
