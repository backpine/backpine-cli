import { Template } from "./types/index.js";

export const templates: Template[] = [
  {
    name: "saas-kit",
    description:
      "A complete SaaS starter kit with authentication, billing, and more",
    repo: "https://github.com/backpine/saas-kit.git",
    branch: "main",
    category: "SaaS",
  },
  {
    name: "tanstack-start-on-cloudflare",
    description:
      "A basic tanstack start setup that can ship to cloudflare workers",
    repo: "https://github.com/backpine/tanstack-start-on-cloudflare.git",
    branch: "main",
    category: "Starter Kit",
  },
  {
    name: "tanstack-trpc-on-cloudflare",
    description: "Tanstack Router + Query + tRPC on Cloudflare Workers",
    repo: "https://github.com/backpine/tanstack-trpc-on-cloudflare.git",
    branch: "main",
    category: "Starter Kit",
  },
  {
    name: "effect-worker",
    description: "Effect on Cloudflare Worker runtime",
    repo: "https://github.com/backpine/effect-worker",
    branch: "main",
    category: "Effect",
  },
  {
    name: "effect-worker-mono",
    description: "Effect on Cloudflare Worker runtime (Monorepo)",
    repo: "https://github.com/backpine/effect-worker-mono",
    branch: "main",
    category: "Effect",
  },
];

export function getTemplate(name: string): Template | undefined {
  return templates.find((template) => template.name === name);
}

export function getDefaultTemplate(): Template {
  return templates[0];
}
