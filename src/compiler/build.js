#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { compile } from './compiler.js'

let errCount = 0;

// 1. CONFIG PATHS
const targetRoot = process.cwd();
const dataDir = path.join(targetRoot, "data");

function shortenPath(fullPath) {
    const parts = fullPath.split(/[/\\]/);
    const srcIndex = parts.indexOf("functions");
    return srcIndex >= 0 ? parts.slice(srcIndex).join(path.sep) : fullPath;
}

// 2. THE MAIN EXECUTION
function build() {
    console.log("Starting Ophoel compilation...");

    if (!fs.existsSync(dataDir)) {
        console.error("Error: 'data' folder not found inside root.");
        return;
    }

    const namespaces = fs.readdirSync(dataDir).filter(f => {
        return fs.statSync(path.join(dataDir, f)).isDirectory();
    });


    namespaces.forEach(ns => {
        const ophoelFolder = path.join(dataDir, ns, "ophoel");
        const srcDir = path.join(ophoelFolder, "functions");


        if (fs.existsSync(srcDir)) {
            const configDir = path.join(ophoelFolder, "ophoel_config.json");
            const config = JSON.parse(fs.readFileSync(configDir, 'utf8'));
            
            console.log(`Namespace found: ${ns}`);
            const outDir = path.join(dataDir, ns, "functions");

            compileDirectory(srcDir, outDir, config);
        }
    })

    if (errCount > 1) {
        console.log("Error occurred while building.");
        console.log("Errors found: " + errCount)
    } else {
        console.log("Built successfully!");
    }
}


function compileDirectory(currentSrc, currentOut, config) {
    // Ensure the output directory exists (mirrors the sub-folder)
    if (!fs.existsSync(currentOut)) {
        fs.mkdirSync(currentOut, { recursive: true });
    }

    const items = fs.readdirSync(currentSrc);

    items.forEach(item => {
        const srcPath = path.join(currentSrc, item);
        const outPath = path.join(currentOut, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            // It's a folder! Dive deeper (Recursion)
            compileDirectory(srcPath, outPath, config);
        } else if (item.endsWith('.oph')) {
            // It's an Ophoel file! Compile it
            try {
                const source = fs.readFileSync(srcPath, 'utf8');
                const commands = compile(source, config, item);
                const finalOutPath = outPath.replace('.oph', '.mcfunction');
                fs.writeFileSync(finalOutPath, commands);

                console.log(`Successfully compiled: ${shortenPath(srcPath)}`);
            } catch (err) {
                console.error(`Error in compiling ${item}: ${err.message}`);
                errCount++;
                throw err;
            }
        }
    });
}



build();