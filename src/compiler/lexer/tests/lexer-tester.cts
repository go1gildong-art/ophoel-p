import { TestResult } from "../../test-resources/test-result.cjs";
import { Tester } from "../../test-resources/tester.cjs";
import { LexerGoldenTester } from "./golden-test/lexer-golden-tester.cjs";

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