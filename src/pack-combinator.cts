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

const folder = "eee";
const nodes: Record<string, any> = {};

const entries = await readdir(folder);

const packs = entries.filter(name => !name.startsWith("--"))


const result = packs.forEach(packFolder => {
    const pack = path.resolve(join(folder, packFolder));
    

    const nodeFile = require(join(pack, "nodes.cjs"));
    Object.assign(nodes, nodeFile);
})