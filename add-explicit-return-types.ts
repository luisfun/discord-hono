import path from 'node:path'
import { Project } from 'ts-morph'

const project = new Project({ tsConfigFilePath: 'tsconfig.json' })
const sources = project.getSourceFiles(['src/**/*.ts'])

for (const source of sources) {
  const filePath = source.getFilePath()
  if (filePath.endsWith('.test.ts')) {
    continue
  }
  console.group(path.relative(process.cwd(), filePath))
  for (const cls of source.getClasses()) {
    console.group(cls.getName())
    for (const method of cls.getMethods()) {
      const returnType = method.getReturnTypeNode();
      if (returnType !== undefined) {
        continue;
      }
      console.log(method.getName());
      method.setReturnType(method.getReturnType().getText(method));
    }
    console.groupEnd()
  }
  console.groupEnd()
}

project.saveSync();
