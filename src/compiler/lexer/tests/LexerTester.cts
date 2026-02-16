import { TestResult } from "../../testResources/testResult.cjs";
import { Tester } from "../../testResources/tester.cjs";
import { LexerGoldenTester } from "./goldenTest/LexerGoldenTester.cjs";

class LexerTester implements Tester {
    test(): TestResult {
        const goldenResult = new LexerGoldenTester().test();

        return TestResult.buildFromChildren(
            [goldenResult],
            "Full lexer test succeed!",
            "Full lexer test failed."
        )
    }
}

console.log(new LexerTester().test());