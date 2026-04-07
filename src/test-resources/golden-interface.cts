import { parse } from "../compiler/parser.cjs";
import { TestResult, TestState } from "./test-result.cjs";

export abstract class GoldenCase<source_T, result_T> {

    readonly title: string;
    readonly description: string;
    readonly source: source_T;
    readonly expectation: result_T;
    readonly skip: boolean;
    readonly link: string;
    readonly process: (arg: source_T) => Promise<result_T>
    readonly compare: (a: result_T, b: result_T) => boolean

    constructor({ title, description, source, expectation, skip, link, process, compare }: {
        title: string;
        description: string;
        source: source_T;
        expectation: result_T;
        skip: boolean;
        link: string;
        process: (arg: source_T) => Promise<result_T>;
        compare?: (a: result_T, b: result_T) => boolean

    }) {
        this.title = title;
        this.description = description;
        this.source = source;
        this.expectation = expectation;
        this.skip = skip;
        this.link = link;
        this.process = process;
        this.compare = compare ?? ((a, b) => a === b);
    }

    async test(): Promise<TestResult> {
        try {
            if (this.skip) return TestResult.skip();

            const actual = await this.process(this.source);
            const isMatch = this.compare(this.expectation, actual);

            const msg = {
                result: isMatch ? "Test result matched." : "Test result did not match.",
                title: this.title,
                description: this.description,
                expected: this.expectation,
                __actual: actual
            };

            return new TestResult(
                isMatch ? TestState.Success : TestState.Failure,
                msg,
                [],
                this.link
            );
        } catch (err) {
            const msg = { title: this.title, description: this.description };
            return TestResult.errorVerbose(err, msg, this.link);
        }
    }
}