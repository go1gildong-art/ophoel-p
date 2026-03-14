import { TestResult } from "../../test-resources/test-result.cjs";
import { Tester } from "../../test-resources/tester.cjs";
import { LexerGoldenTester } from "./golden/tester.cjs";

export class LexerTester implements Tester {
    public async test() {
        try {
            const goldenResult = await new LexerGoldenTester().test();

            return TestResult.buildFromChildren(
                [goldenResult],
                "Full lexer test succeed!",
                "Full lexer test failed."
            )

        } catch (error) {
            return TestResult.error(error);
        }
    }
}

