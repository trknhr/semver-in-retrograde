export const APP_MODEL = "gemini-3.1-flash-lite-preview";
export const FALLBACK_MODEL_LABEL = "local-contingency-copy";
export const APP_SUBTITLE = "Boardroom-certified manifest divination";

export const SAMPLE_MANIFESTS = [
  {
    id: "boardroom-next",
    label: "Boardroom Next",
    description: "A politely overgoverned Next.js stack with mild monorepo energy.",
    manifest: `{
  "name": "quarterly-synergy-portal",
  "private": true,
  "packageManager": "pnpm@10.1.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "next dev",
    "build": "turbo run build",
    "lint": "eslint .",
    "test": "vitest run",
    "postinstall": "husky"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^4.1.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "typescript": "^5.8.0",
    "turbo": "^2.5.0",
    "vitest": "^3.1.0"
  },
  "peerDependencies": {
    "react": ">=19"
  },
  "overrides": {
    "react-is": "19.0.0"
  }
}`,
  },
  {
    id: "creative-vite",
    label: "Creative Vite",
    description: "A fast-moving frontend with aggressively flexible commitment levels.",
    manifest: `{
  "name": "campaign-microsite-lab",
  "private": true,
  "packageManager": "npm@11.3.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "playwright test",
    "predeploy": "echo calibrating brand energy"
  },
  "dependencies": {
    "react": "latest",
    "react-dom": "^19.0.0",
    "three": "*",
    "framer-motion": "^12.0.0",
    "vite": "^7.0.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.0",
    "typescript": "~5.8.0",
    "vite": "^7.0.0"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}`,
  },
  {
    id: "haunted-library",
    label: "Haunted Library",
    description: "A package that insists everything is fine while resolutions multiply.",
    manifest: `{
  "name": "legacy-commerce-widget",
  "version": "4.7.2",
  "private": false,
  "scripts": {
    "build": "webpack --mode production",
    "test": "jest",
    "prebuild": "node scripts/prepare.js",
    "postbuild": "node scripts/postbuild.js",
    "postinstall": "patch-package"
  },
  "dependencies": {
    "react": "^18.3.0",
    "styled-components": "~6.1.0",
    "lodash": "latest",
    "axios": "*",
    "webpack": "^5.98.0"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "patch-package": "^8.0.0",
    "typescript": "^5.7.0"
  },
  "peerDependencies": {
    "react": ">=18",
    "styled-components": ">=6"
  },
  "resolutions": {
    "minimatch": "^9.0.5"
  },
  "overrides": {
    "glob-parent": "^6.0.2"
  }
}`,
  },
] as const;
