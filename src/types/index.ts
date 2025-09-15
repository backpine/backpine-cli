export interface Template {
  name: string;
  description: string;
  repo: string;
  branch?: string;
  category?: string;
}

export interface CreateOptions {
  name?: string;
}

export interface ProjectConfig {
  name: string;
  template: Template;
  targetDir: string;
}
