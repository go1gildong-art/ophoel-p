import { Tester } from "../../../test-resources/tester.cjs";
import { TestResult } from "../../../test-resources/test-result.cjs";
import { Token } from "../../../tokens/token.cjs";
import { UnitCase } from "./units/unit-case.cjs";
import { CodeLexer } from "../../code-lexer.cjs";
import { TokenStream } from "../../../tokens/token-stream.cjs";

export class UnitTester implements Tester {

    private tokenResults: Array<TestResult> = []; // to store the comparison of individual lines

    private expectations: TokenStream;
    private testResults: TokenStream;

    private title: string;

    constructor(unit: UnitCase) {
        this.expectations = unit.expectation;
        this.testResults = new CodeLexer(unit.source, unit.title + ".oph").tokenize();
        this.title = unit.title;
    }

    async test() {
        this.checkTokenCounts();
        this.loopOnTokens();
        return this.gatherResult();
    }

    private emitResult(result: TestResult) {
        this.tokenResults.push(result);
    }

    private checkTokenCounts() {
        const expecLength = this.expectations.tokens.length;
        const resultLength = this.testResults.tokens.length;

        if (expecLength === resultLength) {
            const msg = "Expectations and Results have same length."
            this.emitResult(TestResult.success(msg));

        } else if (expecLength > resultLength) {
            const msg = "Expectation has more tokens than Result."
            this.emitResult(TestResult.failure(msg));

        } else if (expecLength < resultLength) {
            const msg = "Result has more token than Expectation."
            this.emitResult(TestResult.failure(msg));
        }
    }

    private loopOnTokens() {
        for (let i = 0; i < this.expectations.tokens.length; i++) {
            const opt_exp = this.expectations.tokens[i]!; // used !, as for loop guarantees nonnull
            const opt_res = this.testResults.tokens[i];

            if (!opt_res) {
                const msg = `Missing token at index ${i}, as"${opt_exp.toString()}"`;
                this.emitResult(TestResult.failure(msg));
                continue;
            }

            // if (!opt_exp || !opt_res) continue;
            const exp = opt_exp;
            const res = opt_res;
            this.compareTokens(exp, res, i);
        }
    }


    private compareTokens(exp: Token, res: Token, index: number) {
        let unmatchingPortions: Array<string> = [];

        if (exp.kind !== res.kind) unmatchingPortions.push("kind");
        if (exp.value !== res.value) unmatchingPortions.push("value");
        if (exp.location.fileName !== res.location.fileName) unmatchingPortions.push("file name");
        if (exp.location.line !== res.location.line) unmatchingPortions.push("line");
        if (exp.location.column !== res.location.column) unmatchingPortions.push("column");
        if (exp.location.tokenIndex !== res.location.tokenIndex) unmatchingPortions.push("token index");

        if (unmatchingPortions.length > 0) {
            const msg =
                `Unmatching ${unmatchingPortions.join(", ")} found between `
                + `|${exp.toString()}| (expected) and `
                + `|${res.toString()}| (test result)`;
            this.emitResult(TestResult.failure(msg));
            
        } else {
            const msg = `${index}th Token match succeed. |${exp.toString()}|`
            this.emitResult(TestResult.success(msg));
        }
    }

    private gatherResult() {
        const success = TestResult.hasNoFailure(this.tokenResults);
        return TestResult.buildFromChildren(
            this.tokenResults,
            `Lexer golden unit test for ${this.title} succeed!`,
            `Lexer golden unit test for ${this.title} failed.`
        )
    }
}