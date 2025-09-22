# Backpine CLI

A powerful CLI tool for creating projects from curated templates. Get started quickly with modern, production-ready project templates.

## Installation

```bash
npm install -g backpine
```

Or use without installing:

```bash
npx backpine@latest
```

## Usage

### Create a new project

```bash
# Create project in current directory
backpine create saas-kit
# or
npx backpine@latest create saas-kit

# Create project in a new directory
backpine create saas-kit --name my-awesome-app
# or
npx backpine@latest create saas-kit --name my-awesome-app
```

### List available templates

```bash
backpine list
```

### Get help

```bash
backpine --help
backpine create --help
```

## Available Templates

- **saas-kit** - A complete SaaS starter kit with authentication, billing, and more

## Features

- 🚀 **Fast setup** - Get a new project running in seconds
- 🎯 **Curated templates** - Production-ready templates with best practices
- 🔧 **Smart initialization** - Automatically sets up git repository and updates package.json
- 🎨 **Beautiful output** - Colored terminal output with progress indicators

## What it does

1. **Clones** the selected template repository
2. **Removes** git history from the template
3. **Updates** project name in package.json (if --name is provided)
4. **Initializes** a fresh git repository

## License

MIT