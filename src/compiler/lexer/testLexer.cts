import { Token } from "../tokens/token.cjs";
import { CodeLexer } from "./codeLexer.cjs";

// type tokenizeTestResult

type TestState = "Success" | "Failure" | "Uninitialized";

class TestResult {
    state: TestState;
    message: string;
    children: TestResult[];

    constructor(state: TestState, message?: string, children?: TestResult[]) {
        this.state = state;
        this.message = message ?? "";
        this.children = children ?? [];
    }

    static success(message?: string, children?: TestResult[]) {
        return new TestResult("Success" as TestState, message, children);
    }

    static failure(message?: string, children?: TestResult[]) {
        return new TestResult("Failure" as TestState, message, children);
    }

    static uninitialized() {
        return new TestResult("Uninitialized" as TestState);
    }

    static hasNoFailure(results: TestResult[]) {
        return !results.some(r => r.state === "Failure");
    }
}

class TokenGoldenTest {

    testResult: TestResult = TestResult.uninitialized() // to store the test itself's result
    tokenResults: Array<TestResult> = []; // to store the comparison of individual lines

    expectations: Array<Token>;
    testResults: Array<Token>;

    constructor(expectations: Array<Token>, testResults: Array<Token>) {
        this.expectations = expectations;
        this.testResults = testResults;
    }

    emitResult(result: TestResult) {
        this.tokenResults.push(result);
    }

    test() {
        for (let i = 0; i < this.expectations.length; i++) {
            const opt_exp = this.expectations[i];
            const opt_res = this.testResults[i];

            if (opt_exp == null && opt_res == null) {
                const msg = `${i}th index has no token pair.`
                this.emitResult(TestResult.success(msg));
                continue;

            } else if (opt_exp == null && opt_res != null) {
                const msg = `Exceeding token found at token index ${i}, as "${opt_res.toString()}"`;
                this.emitResult(TestResult.failure(msg));
                continue;

            } else if (opt_exp != null && opt_res == null) {
                const msg = `Missing token at index ${i}, as"${opt_exp.toString()}"`;
                this.emitResult(TestResult.failure(msg));
                continue;
            }

            if (!opt_exp || !opt_res) continue;
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
            const msg = `Unmatching ${unmatchingPortions.join(", ")} found between "${exp.toString()}" and "${res.toString()}`;
            this.emitResult(TestResult.failure(msg));
        } else {
            const msg = `${index}th Token match succeed.`
            this.emitResult(TestResult.success(msg));
        }
    }
}

const sources = [
    "let x = 0;"
];

const results = [
    [
        "KW_DECL let source.oph:1:1 (1)",
        "IDENTIFIER x source.oph:1:5 (2)",
        "EQUAL = source.oph:1:7 (3)",
        "NUMBER 0 source.oph:1:9 (4)",
        "SEMICOLON ; source.oph:1:10 (5)"
    ]


]

function testCase(src) {

}

const testLexer = new CodeLexer(sources[0], "test.oph");
console.log(testLexer.tokenize());