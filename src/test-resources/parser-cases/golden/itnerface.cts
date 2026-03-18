import { GoldenCase } from "../../golden-interface.cjs";
import { lispify } from "../../../stringifiers/lispify.cjs";
import { parse } from "../../../compiler/parser.cjs";
import { pipe } from "../../../utils/functional.cjs";
export class ParserGolden extends GoldenCase<{ source: string; __filename: string }, Promise<string>> {
    constructor(args: {
        title: string;
        description: string;
        source: string,
        fileName: string,
        expectation: Promise<string>;

    }) {
        super({ ...args, source: { source: args.source, __filename: args.fileName }, process: pipe(parse, lispify) });
    }
}