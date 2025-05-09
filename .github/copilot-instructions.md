## Project Overview
A library for building Discord bots on Cloudflare Workers.

### Features
- **Intuitive API:** Influenced by Hono, offering a familiar and easy-to-use interface
- **Lightweight:** Zero dependencies, optimized for performance
- **Type-Safe:** Native support for TypeScript

## Coding Standards

- **Code should show "How":** The implementation details should be clear from the code itself.
- **Test code should show "What":** Test cases should clearly state what is being verified or guaranteed.
- **Commit messages should explain "Why":** Each commit message should describe the reason or motivation behind the change.
- **Code comments should clarify "Why not":** Comments should address why alternative approaches were not chosen.

### TypeScript

- Naming Conventions:
  - Default: camelCase
  - rest-path.ts: snake_case base (e.g., _category_$_tag)

### Vitest

- File Naming Conventions: `*.test.ts`

### Code Style
- Use Biome for code formatting and linting
  - `biome.jsonc` - Biome setting file
- Include JSDoc comments for public APIs
