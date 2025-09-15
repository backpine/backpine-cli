import { Template } from './types/index.js';

export const templates: Template[] = [
  {
    name: 'saas-kit',
    description: 'A complete SaaS starter kit with authentication, billing, and more',
    repo: 'https://github.com/backpine/saas-kit.git',
    branch: 'main',
    category: 'SaaS'
  }
];

export function getTemplate(name: string): Template | undefined {
  return templates.find(template => template.name === name);
}

export function getDefaultTemplate(): Template {
  return templates[0];
}