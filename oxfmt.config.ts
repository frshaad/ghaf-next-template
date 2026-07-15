import { defineConfig } from 'oxfmt';
import type { OxlintConfig } from 'oxlint';

const ignorePatterns = [
  '**/node_modules',
  '**/.next',
  '**/dist',
  '**/build',
  '**/out',
  '**/coverage',
  '**/.turbo',
  '**/.vercel',

  '**/__generated__',
  '**/_generated',
  '**/*.generated.*',

  '**/package-lock.json',
  '**/pnpm-lock.yaml',
  '**/yarn.lock',

  '**/next-env.d.ts',

  'prisma/generated',
  'prisma/migrations',
] satisfies OxlintConfig['ignorePatterns'];

export default defineConfig({
  ignorePatterns,
  singleQuote: true,
  sortTailwindcss: true,
  sortImports: {
    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'style'],
  },
  trailingComma: 'es5',
});
