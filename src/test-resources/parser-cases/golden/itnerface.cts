import { GoldenCase } from "../../golden-interface.cjs";
import { Lispifier } from "../../../stringifiers/lispify.cjs";

export class ParserGolden extends GoldenCase<string, string> {


    constructor(args: {

        title: string;
        description: string;
        source: string;
        expectation: string;

    }) {
        return super({ ...args, process: (args: string) => new Lispifier().lispify() });
    }
}