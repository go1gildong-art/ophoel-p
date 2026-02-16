import { Token } from "../../../tokens/token.cjs";
import { CodeLexer } from "../../code-lexer.cjs";
import { TestResult } from "../../../test-resources/test-result.cjs";
import { Tester } from "../../../test-resources/tester.cjs";

import { LexerGoldenUnitTester } from "./lexer-golden-unit-tester.cjs";

import { sources } from "./sources.cjs";
import { expectations } from "./expectations.cjs";

export class LexerGoldenTester implements Tester {

    test() {
        const length = expectations.length;
        const cases: TestResult[] = [];
        for (let index = 0; index < length; index++) {
            const src = sources[index]!;
            const exp = expectations[index]!;

            const unitTest = new LexerGoldenUnitTester(exp, src).test();
            cases.push(unitTest);
        }

        const fullResult = TestResult.buildFromChildren(
            cases,
            "Lexer golden test succeed!",
            "Lexer golden test failed."
        );
        return fullResult;
    }
}