import { readdir } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";
import path from "node:path";

export async function loadTests<T>(folder: string): Promise<T[]> {
  const entries = await readdir(folder);

  const testFiles = entries.filter(
    name => name.startsWith("test_") && name.endsWith(".cjs")
  );

  const tests: T[] = [];

  for (const file of testFiles) {
    const fullPath = path.resolve(join(folder, file));
    
    console.log(fullPath);
    console.log(pathToFileURL(fullPath).href)

    // dynamic import requires file URL
    const module = require(fullPath);
    console.log(module);

    tests.push(module.unit);
  }

  return tests;
}
