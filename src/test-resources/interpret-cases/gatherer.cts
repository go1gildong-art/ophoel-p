import { loadTests } from "../test_loader.cjs";
import { InterpretUnit } from "./unit.cjs";
import { TestResult } from "../test-result.cjs";
import * as fp from "../../utils/functional.cjs";
import path from "node:path";

export async function interpretGatherer() {
    try {
        const dir = path.join(__dirname, "./units");
        const cases = await loadTests<InterpretUnit>(dir);
        const results = await Promise.all(
            cases.map(
                async unitCase => unitCase.test()
            )
        );

        return TestResult.buildFromChildren(
            results,
            "Interpret golden test succeed!",
            "Interpret golden test failed."
        );

    } catch (error) {
        return TestResult.errorVerbose(error);
    }
}