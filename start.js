import { spawn } from "child_process";
import path from "path";

const datapackRoot = process.cwd();
const ophoelBuild = path.resolve(__dirname, "compiler", "build.js");
const watchGlob = path.join(datapackRoot, "data/*/ophoel");
const nodemonPath = path.join()