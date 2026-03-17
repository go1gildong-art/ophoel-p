export class GoldenCase<source_T, result_T> {

    readonly title: string;
    readonly description: string;
    readonly source: source_T;
    readonly expectation: result_T;
    readonly process: (arg: source_T) => result_T   

    constructor({ title, description, source, expectation, process }: {
        title: string;
        description: string;
        source: source_T;
        expectation: result_T;
        process: (arg: source_T) => result_T;
        
    }) {
        this.title = title;
        this.description = description;
        this.source = source;
        this.expectation = expectation;
        this.process = process;
    }
}