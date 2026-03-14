#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const compiler_js_1 = require("./compiler.js");
let errCount = 0;
// 1. CONFIG PATHS
const targetRoot = process.cwd();
const dataDir = path_1.default.join(targetRoot, "data");
function shortenPath(fullPath) {
    const parts = fullPath.split(/[/\\]/);
    const srcIndex = parts.indexOf("functions");
    return srcIndex >= 0 ? parts.slice(srcIndex).join(path_1.default.sep) : fullPath;
}
// 2. THE MAIN EXECUTION
function build() {
    console.log("Starting Ophoel compilation...");
    if (!fs_1.default.existsSync(dataDir)) {
        console.error("Error: 'data' folder not found inside root.");
        return;
    }
    const namespaces = fs_1.default.readdirSync(dataDir).filter(f => {
        return fs_1.default.statSync(path_1.default.join(dataDir, f)).isDirectory();
    });
    namespaces.forEach(ns => {
        const ophoelFolder = path_1.default.join(dataDir, ns, "ophoel");
        const srcDir = path_1.default.join(ophoelFolder, "functions");
        if (fs_1.default.existsSync(srcDir)) {
            const configDir = path_1.default.join(ophoelFolder, "ophoel_config.json");
            const config = JSON.parse(fs_1.default.readFileSync(configDir, 'utf8'));
            console.log(`Namespace found: ${ns}`);
            const outDir = path_1.default.join(dataDir, ns, "functions");
            compileDirectory(srcDir, outDir, config);
        }
    });
    if (errCount > 1) {
        console.log("Error occurred while building.");
        console.log("Errors found: " + errCount);
    }
    else {
        console.log("Built successfully!");
    }
}
function compileDirectory(currentSrc, currentOut, config) {
    // Ensure the output directory exists (mirrors the sub-folder)
    if (!fs_1.default.existsSync(currentOut)) {
        fs_1.default.mkdirSync(currentOut, { recursive: true });
    }
    const items = fs_1.default.readdirSync(currentSrc);
    items.forEach(item => {
        const srcPath = path_1.default.join(currentSrc, item);
        const outPath = path_1.default.join(currentOut, item);
        const stat = fs_1.default.statSync(srcPath);
        if (stat.isDirectory()) {
            // It's a folder! Dive deeper (Recursion)
            compileDirectory(srcPath, outPath, config);
        }
        else if (item.endsWith('.oph')) {
            // It's an Ophoel file! Compile it
            try {
                const source = fs_1.default.readFileSync(srcPath, 'utf8');
                const commands = (0, compiler_js_1.compile)(source, config, item);
                const finalOutPath = outPath.replace('.oph', '.mcfunction');
                fs_1.default.writeFileSync(finalOutPath, commands);
                console.log(`Successfully compiled: ${shortenPath(srcPath)}`);
            }
            catch (err) {
                console.error(`Error in compiling ${item}: ${err.message}`);
                errCount++;
                throw err;
            }
        }
    });
}
build();
//# sourceMappingURL=build.js.map