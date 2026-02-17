import { readdir } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";

export async function loadTests<T>(folder: string): Promise<T[]> {
  const entries = await readdir(folder);

  const testFiles = entries.filter(
    name => name.startsWith("test_") && name.endsWith(".cts")
  );

  const tests: T[] = [];

  for (const file of testFiles) {
    const fullPath = join(folder, file);

    // dynamic import requires file URL
    const module = await import(pathToFileURL(fullPath).href);

    tests.push(module.default);
  }

  return tests;
}
