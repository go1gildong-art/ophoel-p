import { GoldenCase } from "../golden-interface.cjs";
import { parse } from "../../compiler/parser.cjs";
import { Source } from "../../location.cjs";
import * as fp from "../../utils/functional.cjs";
import { ASTNode } from "../../ast.cjs";


export class CodegenUnit extends GoldenCase<Source, string> {
    constructor(args: {
        title: string;
        description: string;
        skip?: boolean;
        link: string;
        source: string;
        ophoelDir: string;
        expectation: string;

    }) {
        super({
            title: args.title,
            description: args.description,
            skip: args.skip ?? false,
            link: args.link,

            expectation: args.expectation,
            source: new Source(args.source, args.ophoelDir),
            process: async (src) => {
                const parseResult = await parse(src).interpretPlaceheld(src.src);
                if (!parseResult.ok) throw parseResult.err;

                return parseResult.ctx.branch().export().codeGen();
            }
        });
    }
}