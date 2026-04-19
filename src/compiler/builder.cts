#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { compile } from './compile.cjs';
import { FileManagerClass } from './file-manager.cjs';
import { Source } from '../location.cjs';

let errCount = 0;

// 1. CONFIG PATHS
const targetRoot = process.cwd();
const dataDir = path.join(targetRoot, "data");

function shortenPath(fullPath: string) {
    const parts = fullPath.split(/[/\\]/);
    const srcIndex = parts.indexOf("functions");
    return srcIndex >= 0 ? parts.slice(srcIndex).join(path.sep) : fullPath;
}

// 2. THE MAIN EXECUTION
async function build() {
    console.log("Starting Ophoel compilation...");
    const fm = new FileManagerClass(dataDir);

    if (!fs.existsSync(dataDir)) {
        console.error("Error: 'data' folder not found inside root.");
        return;
    }

    const namespaces = (await fs.promises.readdir(dataDir)).filter(async f => {
        return (await fs.promises.stat(path.join(dataDir, f))).isDirectory();
    });
    


    await Promise.allSettled(
        namespaces.map(async ns => {
            const ophoelFolder = path.join(dataDir, ns, "ophoel");
            const srcDir = path.join(ophoelFolder, "functions");
            
            console.log(srcDir);
            console.log(fs.existsSync(srcDir));
            if (fs.existsSync(srcDir)) {
                
                console.log(`Namespace found: ${ns}`);
                const outDir = path.join(dataDir, ns, "functions");
                await compileDirectory(srcDir, outDir, fm);
            }
        })
    )

    if (errCount > 1) {
        console.log("Error occurred while building.");
        console.log("Errors found: " + errCount)
    } else {
        console.log("Built successfully!");
    }
}


async function compileDirectory(currentSrc: string, currentOut: string, fm: FileManagerClass) {
    // Ensure the output directory exists (mirrors the sub-folder)
    if (!fs.existsSync(currentOut)) {
        fs.mkdirSync(currentOut, { recursive: true });
    }

    const items = fs.readdirSync(currentSrc);

    items.forEach(async item => {
        const srcPath = path.join(currentSrc, item);
        const outPath = path.join(currentOut, item);
        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            compileDirectory(srcPath, outPath, fm);

        } else if (item.endsWith('.oph')) {
            try {
                const mcfunction = await compile({
                    src: await fm.readFile(path.relative(dataDir, srcPath)),
                    ophoelDir: shortenPath(srcPath)
                }, fm);

                const finalOutPath = outPath.replace('.oph', '.mcfunction');
                fs.writeFileSync(finalOutPath, mcfunction);
                console.log(`Successfully compiled: ${shortenPath(srcPath)}`);
            } catch (err) {
                if (err instanceof Error) {
                    console.error(`Error in compiling ${item}: \n${err.message}\n\n`);
                }
                else console.error(`Error in compiling ${item}: ${err}`);

                errCount++;
                throw err;
            }
        }
    });
}



build();