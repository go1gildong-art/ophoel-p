import * as path from "path";
import * as fs from "fs";
import * as fp from "../utils/functional.cjs";

import { parse } from "./parser.cjs";
import { Context, InterpretReturn } from "./interpreter/utilities.cjs";
import { ASTTypes } from "../pack-combinator.cjs";
import { Source } from "../location.cjs";
import * as res from "@utils/result.cjs";

export class FileReadError extends Error { }

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

    async getSrc(target: string) {
        const src = await this.readFile(target);
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

                const msg = ({
                    "ENOENT": `File not found: (...data/) ${target}`,
                    "EISDIR": `Expected file but got directory: (...data/) ${target}`,
                    "EACCES": `Permission denied: (...data/) ${target}`
                }[err.code as string]
                    ?? `Unknown error: ${err.code}`);

                throw new FileReadError(msg);
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