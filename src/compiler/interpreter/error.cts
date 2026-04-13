import { ASTKind } from "../../ast.cjs";
import { Location } from "../../location.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { FileManager } from "../file-manager.cjs";

export class OphoelError extends Error {
    constructor(
        public msg: string,
        public src: string,
        public loc: Location) {

        const fullMsg = [
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
        const sliced = src.split("\n")
            .map((ln, i) => ({ index: i + 1, ln: ln.trim() }))
            .slice(loc.line - 1, loc.line + 1)
            .map(entry => `${entry.index} | ${entry.ln}`);

        const gutterLine = 2;
        sliced.splice(gutterLine, 0, // 2 because prev / errLine / ^^^ / nextLine
            `${" ".repeat(
                (sliced[1]?.indexOf("|") ?? 0) + loc.column
            ) + "^^^"}`);

        return sliced.join("\n");
    }
}