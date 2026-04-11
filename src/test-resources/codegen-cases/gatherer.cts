import { loadTests } from "../test_loader.cjs";
import { CodegenUnit } from "./unit.cjs";
import { TestResult } from "../test-result.cjs";
import * as fp from "../../utils/functional.cjs";
import path from "node:path";

export async function codegenGatherer() {
    try {
        const dir = path.join(__dirname, "./units");
        const cases = await loadTests<CodegenUnit>(dir);
        const results = await Promise.all(
            cases.map(
                async unitCase => unitCase.test()
            )
        );

        return TestResult.buildFromChildren(
            results,
            "Codegen golden test succeed!",
            "Codegen golden test failed."
        );

    } catch (error) {
        return TestResult.errorVerbose(error);
    }
}