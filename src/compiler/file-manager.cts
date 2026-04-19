import * as path from "path";
import * as fs from "fs";
import * as fp from "../utils/functional.cjs";

import { parse } from "./parser.cjs";
import { Context, InterpretReturn } from "./interpreter/utilities.cjs";
import { ASTTypes } from "../pack-combinator.cjs";
import { Source } from "../location.cjs";
import { res } from "#utils";

async function interpret(src: string) {

}

export interface FileManager {
    // ns will hold path from beginning to namespace folder
    // C:/.../my-pack/data
    dataFolder: string,
    getSrc(target: string): Promise<string>,
    include(target: string, ctx: Context): Promise<InterpretReturn>,
    programCache: { target: string, ast: ASTTypes["Program"] }[]
}

export class FileManagerClass implements FileManager {
    constructor(public dataFolder: string) { }

    /*
    async include(target: string): Promise<Context | placeholder> {
        path.join(this.mcNamespace, "ophoel", target);
        return new Context();
    }
        */

    async getSrc(target: string) {
        const fullPath = path.join(this.dataFolder, "ophoel", target);
        const src = await fs.promises.readFile(fullPath, 'utf-8');
        return src;
    }

    programCache: { target: string, ast: ASTTypes["Program"] }[] = [];

    async include(target: string, ctx: Context): Promise<InterpretReturn> {

        let ast: ASTTypes["Program"];
        const foundCache = this.programCache.find(cache => cache.target === target);

        if (foundCache) ast = foundCache.ast;
        else {
            const srcCode = await this.readFile(target);
            const srcObj = new Source(srcCode, target);
            const parsedAST = parse(srcObj);

            this.programCache.push({ target, ast: parsedAST });
            ast = parsedAST;
        }

        const result = await ast.evaluate(ctx);
        return result;
    }

    async readFile(target: string): Promise<string> {
        try {
            const fullPath = path.join(this.dataFolder, target);
            const content = await fs.promises.readFile(fullPath, 'utf-8');
            return content;

        } catch (err) {
            if (err instanceof Error && "code" in err) {
                if (err.code === "ENOENT") {
                    throw new Error(`File not found: ${target}`);
                }
                if (err.code === "EISDIR") {
                    throw new Error(`Expected file but got directory: ${target}`);
                }
                if (err.code === "EACCES") {
                    throw new Error(`Permission denied: ${target}`);
                }
            }

            throw err;
        }
    }
}

const placeholderMsgs = {
    datapack: "PLACEHOLDER FileManager does not contain minecraft datapack folder",
    include: "PLACEHOLDER FileManager cannot include dynamic path"
}
export class FMPlaceholder implements FileManager {
    constructor(public src: string) { }
    dataFolder: string = placeholderMsgs.datapack;

    async getSrc(target: string): Promise<string> { return this.src; }
    async include(target: string, context: Context): Promise<InterpretReturn> {
        throw new Error(placeholderMsgs.include);
    }
    programCache = [];
}