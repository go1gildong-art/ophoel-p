import { TestResult, TestState } from "./test-result.cjs";

export abstract class GoldenCase<source_T, result_T> {

    readonly title: string;
    readonly description: string;
    readonly source: source_T;
    readonly expectation: result_T;
    readonly skip: boolean;
    readonly process: (arg: source_T) => Promise<result_T>

    constructor({ title, description, source, expectation, skip, process }: {
        title: string;
        description: string;
        source: source_T;
        expectation: result_T;
        skip: boolean;
        process: (arg: source_T) => Promise<result_T>;

    }) {
        this.title = title;
        this.description = description;
        this.source = source;
        this.expectation = expectation;
        this.skip = skip;
        this.process = process;
    }

    test(compare: <T>(a: T, b: T) => boolean): TestResult {
        try {
            if (this.skip) return new TestResult(Test) 

            const expected = this.expectation;
            const actual = await this.process(this.source);

            const matches = compare(expected, actual);
            const state = matches ? TestState.Success : TestState.Failure;
            const msg = matches ? "Test result matched." : "Test result did not match.";
            return new TestResult(state, msg);
        }
        
    }
}