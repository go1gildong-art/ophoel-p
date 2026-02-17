import { Token } from "../../../tokens/token.cjs";
import { CodeLexer } from "../../code-lexer.cjs";
import { TestResult } from "../../../test-resources/test-result.cjs";
import { Tester } from "../../../test-resources/tester.cjs";

import { UnitTester } from "./unit-tester.cjs";
import { UnitCase } from "./units/unit-case.cjs";

import { sources } from "./sources.cjs";
import { expectations } from "./expectations.cjs";

import { loadTests } from "../../../test-resources/test_loader.cjs";


export class LexerGoldenTester implements Tester {

    async test() {
        const cases = await loadTests<UnitCase>("./out/compiler/lexer/tests/golden/units");
        const results = [];

        for (const unitCase of cases) {
            const unitTest = await new UnitTester(unitCase).test();
            results.push(unitTest);
        }

        const fullResult = TestResult.buildFromChildren(
            results,
            "Lexer golden test succeed!",
            "Lexer golden test failed."
        );
        return fullResult;
    }
}