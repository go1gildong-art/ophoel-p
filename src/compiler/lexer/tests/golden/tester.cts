import { TestResult } from "../../../test-resources/test-result.cjs";
import { Tester } from "../../../test-resources/tester.cjs";

import { UnitTester } from "./unit-tester.cjs";
import { UnitCase } from "./units/unit-case.cjs";

import { loadTests } from "../../../test-resources/test_loader.cjs";


export class LexerGoldenTester implements Tester {

    public async test() {
        const cases = await loadTests<UnitCase>("./out/compiler/lexer/tests/golden/units");

        const results = await Promise.all(cases.map(async unitCase => new UnitTester(unitCase).test()));

        return TestResult.buildFromChildren(
            results,
            "Lexer golden test succeed!",
            "Lexer golden test failed."
        );
    }
}