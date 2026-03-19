import { loadTests } from "../test_loader.cjs";
import { ParserUnit } from "./unit.cjs";
import { TestResult } from "../test-result.cjs";
import * as fp from "../../utils/functional.cjs";
import path from "node:path";

export async function parserGatherer() {
    try {
        const dir = path.join(__dirname, "./units");
        const cases = await loadTests<ParserUnit>(dir);
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
        return TestResult.errorVerbose(error);
    }
}

(async () => {
    const result = await parserGatherer();
    const jsonResult = JSON.stringify(result, null, 2);
    console.log(jsonResult);
}
)();