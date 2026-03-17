import { GoldenCase } from "../../golden-interface.cjs";

export class ParserGolden implements GoldenCase<string, string> {
    readonly title: string;
    readonly description: string;
    readonly source: string;
    readonly expectation: string;
    readonly process: ((arg: string) => string)

    constructor({ title, description, source, expectation, process }: {

        title: string;
        description: string;
        source: string;
        expectation: string;
        process: (arg: string) => string;
        
    }) {
        this.title = title;
        this.description = description;
        this.source = source;
        this.expectation = expectation;
        this.process = process;
    }
}