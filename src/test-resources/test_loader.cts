import { readdir } from "fs/promises";
import { join } from "path";
import path from "node:path";

export async function loadTests<T>(folder: string): Promise<T[]> {
  const entries = await readdir(folder);

  const testFiles = entries.filter(
    name => name.startsWith("test_") && name.endsWith(".cjs")
  );

  return testFiles.map(file => {
    const fullPath = path.resolve(join(folder, file));
    const module = require(fullPath);
    return module.unit;
  });
}