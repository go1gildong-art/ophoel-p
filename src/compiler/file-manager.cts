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
    includeCache: { target: string, ast: ASTTypes["Program"] }[]
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

    includeCache: { target: string, ast: ASTTypes["Program"] }[] = [];

    async include(target: string, ctx: Context): Promise<InterpretReturn> {

        let ast: ASTTypes["Program"];
        const foundCache = this.includeCache.find(cache => cache.target === target);

        if (foundCache) ast = foundCache.ast;
        else {
            const targetFull = path.join(this.dataFolder, target);
            const srcCode = await fs.promises.readFile(targetFull, 'utf8');
            const srcObj = new Source(srcCode, target);
            const parsedAST = parse(srcObj);

            this.includeCache.push({ target, ast: parsedAST });
            ast = parsedAST;
        }

        const result = await ast.evaluate(ctx);
        return result;
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
    includeCache = [];
}