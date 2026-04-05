import { parserGatherer } from "./parser-cases/gatherer.cjs";
import { interpretGatherer } from "./interpret-cases/gatherer.cjs";
import { TestResult } from "./test-result.cjs";

import path from "node:path";
import fs from "node:fs";

(async () => {
    const filePath = path.join(__dirname, '../../tests/test-full.json');

    const tests = [
        parserGatherer,
        interpretGatherer
    ];


    const result = TestResult.buildFromChildren(
        await Promise.all(tests.map(test => test())),
        "All golden tests succeeded!",
        "Some golden tests failed."
    );

    fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf-8');
    console.log("\n" + result.message)
}
)();