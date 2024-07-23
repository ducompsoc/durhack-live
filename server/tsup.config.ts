import { defineConfig } from "tsup";
import * as glob from 'glob'
import * as path from 'node:path'

const configFilePaths = glob.sync('src/config/*.ts');
const configFileEntryArray = configFilePaths
  .filter(filePath => !filePath.endsWith("index.ts") && !filePath.endsWith("schema.ts"))
  .map((filePath) => {
    return [`config/${path.parse(filePath).name}`, filePath]
  })
const configFileEntries = Object.fromEntries(configFileEntryArray)

export default defineConfig([
  {
    entry: {
      main: "src/main.ts",
      ...configFileEntries
    },
    target: "esnext",
    format: "esm",
    splitting: true,
    clean: true,
    minify: false,
    outDir: "dist",
  },
]);
