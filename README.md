# Backpine CLI

A powerful CLI tool for creating projects from curated templates. Get started quickly with modern, production-ready project templates.

## Installation

```bash
npm install -g backpine-cli
```

## Usage

### Create a new project

```bash
# Interactive mode - CLI will prompt you for project name and template
backpine create

# Specify project name
backpine create my-awesome-app

# Specify both project name and template
backpine create my-saas-app --template saas-kit
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
- 💡 **Interactive prompts** - User-friendly CLI with helpful prompts
- 🎨 **Beautiful output** - Colored terminal output with progress indicators

## What it does

1. **Clones** the selected template repository
2. **Removes** git history from the template
3. **Updates** project name in package.json
4. **Initializes** a fresh git repository
5. **Creates** initial commit

## Development

```bash
# Clone the repository
git clone https://github.com/backpine/backpine-cli.git
cd backpine-cli

# Install dependencies
npm install

# Build the project
npm run build

# Test locally
node bin/backpine.js --help
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

MIT