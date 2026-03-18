import { GoldenCase } from "../../golden-interface.cjs";
import { lispify } from "../../../stringifiers/lispify.cjs";
import { parse } from "../../../compiler/parser.cjs";

export class ParserGolden extends GoldenCase<string, string> {


    constructor(args: {

        title: string;
        description: string;
        source: string;
        expectation: string;

    }) {
        super({ ...args, process: (arg: string) => lispify(parse(arg, `${this.title}.oph`)) });
    }
}