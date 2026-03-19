import { GoldenCase } from "../golden-interface.cjs";
import { lispify } from "../../stringifiers/lispify.cjs";
import { parse } from "../../compiler/parser.cjs";
import * as fp from "../../utils/functional.cjs";

export class ParserUnit extends GoldenCase<{ source: string; __filename: string }, string> {
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
            process: fp.pipe(fp.print, parse, fp.print, lispify)
        });
    }
}