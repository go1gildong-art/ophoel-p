import { loadTests } from "../test_loader.cjs";
import { ParserUnit } from "./unit.cjs";
import { TestResult } from "../test-result.cjs";

export async function ParserTest() {
    try {
        const cases = await loadTests<ParserUnit>("./units");
        cases.forEach(c => console.log(c.title));
        const results = await Promise.all(
            cases.map(
                async unitCase => unitCase.test()
            )
        );

        return TestResult.buildFromChildren(
            results,
            "Parser golden test succeed!",
            "Parser golden test failed."
        );

    } catch (error) {
        return TestResult.error(error);
    }
}