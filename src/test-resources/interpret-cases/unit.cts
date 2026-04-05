import { GoldenCase } from "../golden-interface.cjs";
import { parse } from "../../compiler/parser.cjs";
import * as fp from "../../utils/functional.cjs";
import { ASTNode } from "../../ast.cjs";

export class InterpretUnit extends GoldenCase<{ source: string; __filename: string }, string> {
    constructor(args: {
        title: string;
        description: string;
        skip?: boolean;
        source: string;
        fileName: string;
        expectation: string;

    }) {
        super({
            title: args.title,
            description: args.description,
            skip: args.skip ?? false,

            expectation: args.expectation,
            source: { source: args.source, __filename: args.fileName },
            process: async (src) => {
                const parseResult = await parse(src).evaluate();
                if (!parseResult.ok) throw parseResult.err;

                return parseResult.ctx.branch().export().nonLocString();
            }
        });
    }
}