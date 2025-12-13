---
applyTo: 'src/rest/rest-path.ts'
---
## Naming Conventions
- Convert `/` to `$` and `{VER}` to `_`
- `varName = varValue.replaceAll('/', '$').replaceAll('{VAR}', '_')`
### Example
varValue: `/categories/{category}/tags/{tag}`
varName: `$categories$_$tags$_`
code: `const $categories$_$tags$_ = '/categories/{category}/tags/{tag}'`
