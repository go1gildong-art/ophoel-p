import { tests } from "vscode";
import { Token } from "../tokens/token.cjs";
import { CodeLexer } from "./codeLexer.cjs";

// type tokenizeTestResult



enum TestState {
    Success = "SUCCESS",
    Failure = "FAILURE",
    Uninitialized = "UNINITIALIZED"
}

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
        return new TestResult(TestState.Success, message, children);
    }

    static failure(message?: string, children?: TestResult[]) {
        return new TestResult(TestState.Failure, message, children);
    }

    static uninitialized() {
        return new TestResult(TestState.Uninitialized
        );
    }

    static hasNoFailure(results: TestResult[]) {
        return !results.some(r => r.state === TestState.Failure);
    }
}

class TokenGoldenTest {

    private testResult: TestResult = TestResult.uninitialized() // to store the test itself's result
    private tokenResults: Array<TestResult> = []; // to store the comparison of individual lines

    private expectations: Array<Token>;
    private testResults: Array<Token>;

    constructor(expectations: Array<string>, source: string) {
        this.expectations = expectations.map(stringToken => Token.fromString(stringToken));
        this.testResults = new CodeLexer(source, "test.oph").tokenize();
    }

    test() {
        this.loopOnTokens();
        return this.gatherResult();
    }

    private emitResult(result: TestResult) {
        this.tokenResults.push(result);
    }

    private loopOnTokens() {
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
            const msg = `${index}th Token match succeed. "${exp.toString()}"`
            this.emitResult(TestResult.success(msg));
        }
    }

    private gatherResult() {
        const success = TestResult.hasNoFailure(this.tokenResults);
        if (success) {
            this.testResult = TestResult.success("Lexer golden test succeed!", this.tokenResults);
        } else {
            this.testResult = TestResult.failure("Lexer golden test failed.", this.tokenResults);
        }
        return this.testResult;
    }
}

const sources = [
    "let x = 0;"
];

const expectations = [
    [
        `KW_DECL "let" test.oph:1:1 (0)`,
        `IDENTIFIER "x" test.oph:1:5 (1)`,
        `EQUAL "=" test.oph:1:7 (2)`,
        `NUMBER "0" test.oph:1:9 (3)`,
        `SEMICOLON ";" test.oph:1:10 (4)`
    ]
]

const index = 0;
const src = sources[index]!;
const exp = expectations[index]!;

const testtt = new TokenGoldenTest(exp, src).test();
console.log(testtt);
