import * as path from "path";
import * as fs from "fs";
import * as fp from "../utils/functional.cjs";

import { parse } from "./parser.cjs";
import { Context } from "./interpreter/utilities.cjs";

async function interpret(src: string) {

}

export interface FileManager {
    mcNamespace: string
    getSrc(target: string): Promise<string>
}

export class FileManagerClass implements FileManager {
    constructor(public mcNamespace: string) { }

    /*
    async include(target: string): Promise<Context | placeholder> {
        path.join(this.mcNamespace, "ophoel", target);
        return new Context();
    }
        */

    async getSrc(target: string) {
        const fullPath = path.join(this.mcNamespace, "ophoel", target);
        const src = await fs.promises.readFile(fullPath, { encoding: 'utf-8'});
        return src;
    }
}

export class FMPlaceholder implements FileManager {
    constructor(public src: string) {}
    mcNamespace: string = "PLACEHOLDER does not contain minecraft namespace";

    async getSrc(target: string): Promise<string> {
        return this.src;
    }
}