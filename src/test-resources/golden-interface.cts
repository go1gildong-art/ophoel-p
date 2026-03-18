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

    async test(compare: (a: result_T, b: result_T) => boolean = ((a, b) => a === b)): Promise<TestResult> {
        try {
            if (this.skip) return TestResult.skip();

            const actual = await this.process(this.source);
            const isMatch = compare(this.expectation, actual);

            return new TestResult(
                isMatch ? TestState.Success : TestState.Failure,
                isMatch ? "Test result matched." : "Test result did not match."
            );
        } catch (err) {
            return TestResult.error(err);
        }
    }
}