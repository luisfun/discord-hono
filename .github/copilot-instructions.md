## Project Overview
This library enables you to easily build Discord bots on Cloudflare Workers.

### Features
- **Intuitive API** - Influenced by Hono, offering a familiar and easy-to-use interface
- **Lightweight** - Zero dependencies, optimized for performance
- **Type-Safe** - Native support for TypeScript

## Coding Standards

### TypeScript Files (.ts)
- Naming Conventions:
  - Default: camelCase
  - rest-path.ts: snake_case base (e.g., _category_$_tag)
- Test framework: Vitest
  - `*.spec.ts` - Unit tests
  - `*.test.ts` - Integration tests

### Code Style
- Use Biome for code formatting and linting
  - `biome.jsonc` - Biome setting file
- Include JSDoc comments for public APIs
