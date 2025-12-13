---
applyTo: 'src/rest/rest-path.ts'
---
## Naming Conventions
Convert the value to a variable name using the following rules:
- Replace `/` with `$`
- Replace `{VER}` with `_`
### Example
varValue: `/categories/{category}/tags/{tag}`
varName: `$categories$_$tags$_`
code: `const $categories$_$tags$_ = '/categories/{category}/tags/{tag}'`
