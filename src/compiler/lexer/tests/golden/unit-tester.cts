import { Tester } from "../../../test-resources/tester.cjs";
import { TestResult } from "../../../test-resources/test-result.cjs";
import { Token } from "../../../tokens/token.cjs";
import { UnitCase } from "./units/unit-case.cjs";
import { CodeLexer } from "../../code-lexer.cjs";
import { TokenStream } from "../../../tokens/token-stream.cjs";

export class UnitTester implements Tester {

    private tokenResults: Array<TestResult> = []; // to store the comparison of individual lines

    private readonly expectations: TokenStream;
    private readonly testResults: TokenStream;

    private readonly title: string;

    constructor(unit: UnitCase) {
        this.expectations = unit.expectation;
        this.testResults = new CodeLexer(unit.source, unit.title + ".oph").tokenize();
        this.title = unit.title;
    }

    public async test() {
        this.emitResult(this.checkTokenCounts());
        this.emitResult(this.loopTokens());
        return this.gatherResult();
    }

    private emitResult(results: TestResult): void
    private emitResult(results: TestResult[]): void
    private emitResult(results: TestResult | TestResult[]) {
        if (Array.isArray(results)) this.tokenResults.push(...results);
        else this.tokenResults.push(results);
    }

    private checkTokenCounts() {
        try {
            const expecLength = this.expectations.tokens.length;
            const resultLength = this.testResults.tokens.length;

            if (expecLength > resultLength) {
                const msg = "Expectation has more tokens than Result."
                return TestResult.failure(msg);

            } else if (expecLength < resultLength) {
                const msg = "Result has more token than Expectation."
                return TestResult.failure(msg);
            } else {
                const msg = "Expectations and Results have same length."
                return TestResult.success(msg);
            }

        } catch (error) {
             return TestResult.error(error);
        }
    }

    private loopTokens() {
        return this.expectations
            .map((exp, index) => this.compareTokens(exp, this.testResults.at(index)));
    }


    private compareTokens(exp: Token, res: Token | undefined): TestResult {
        try {
            if (!res) {
                const msg = `Missing token at index ${exp.location.tokenIndex}, for "${exp.toString()}"`;
                return TestResult.failure(msg);
            }

            const expFlat = exp.flatten();
            const resFlat = res.flatten();

            const unmatchingPortions = (Object.keys(expFlat) as (keyof typeof expFlat)[])
                .filter(key => expFlat[key] !== resFlat[key]);

            if (unmatchingPortions.length > 0) {
                const msg =
                    `Unmatching ${unmatchingPortions.join(", ")} found between `
                    + `|${exp.toString()}| (expected) and `
                    + `|${res.toString()}| (test result)`;
                return TestResult.failure(msg);

            } else {
                const msg = `${exp.location.tokenIndex}th Token match succeed. |${exp.toString()}|`
                return TestResult.success(msg);
            }

        } catch (error) {
            return TestResult.error(error);
        }
    }

    private gatherResult() {
        return TestResult.buildFromChildren(
            this.tokenResults,
            `Lexer golden unit test for ${this.title} succeed!`,
            `Lexer golden unit test for ${this.title} failed.`
        )
    }
}