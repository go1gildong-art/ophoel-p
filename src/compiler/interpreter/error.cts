import { ASTKind } from "../../ast.cjs";
import { Location } from "../../location.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { FileManager } from "../file-manager.cjs";
import * as res from "../../utils/result.cjs";
import { InterpretReturn } from "./utilities.cjs";

export class OphoelError extends Error {
    constructor(
        public msg: string,
        public src: string,
        public loc: Location) {

        const fullMsg = [
            "",
            OphoelError.prettyErr(src, loc),
            `Error in ${loc.toString()}`,
            msg
        ].join("\n");

        super(fullMsg);
    }

    static async fromNode(msg: string, node: ASTTypes[keyof ASTTypes], fm: FileManager) {
        const src = await fm.getSrc(node.location.dir);
        return new OphoelError(msg, src, node.location);
    }

    static prettyErr(src: string, loc: Location) {
        const slicedEntry = src.split("\n")
            .map((ln, i) => ({ index: i + 1, ln }))
            .slice(loc.line - 1, loc.line + 1);

        const targetIndex = slicedEntry.findIndex(entry => entry.index === loc.line);
        const gutterLine = targetIndex + 1;
        const sliced = slicedEntry.map(entry => `${entry.index} | ${entry.ln}`);

        sliced.splice(gutterLine, 0, // 2 because prev / errLine / ^^^ / nextLine
            " ".repeat((
                sliced[targetIndex]?.indexOf("|") ?? 0) + 1 + loc.column
            ) + "^^^");

        return sliced.join("\n");
    }
}

export class OphoelTSError extends OphoelError { }

export async function makeOphoelError(err: unknown, ast: ASTTypes[keyof ASTTypes], fm: FileManager): Promise<InterpretReturn> {
    if (err instanceof OphoelError) {
        return res.makeErr(err);

    } else if (err instanceof Error) {
        return res.makeErr(await OphoelTSError.fromNode(err.message, ast, fm))

    } else {
        return res.makeErr(err);
    }
}
