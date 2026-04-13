import { GoldenCase } from "../golden-interface.cjs";
import { parse } from "../../compiler/parser.cjs";
import * as fp from "../../utils/functional.cjs";
import { Source } from "../../location.cjs";
import { ASTNode } from "../../ast.cjs";

export class ParserUnit extends GoldenCase<Source, string> {
    constructor(args: {
        title: string;
        description: string;
        link: string;
        skip?: boolean;
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
            process: fp.pipe(parse, fp.method("lispify"))
        });
    }
}