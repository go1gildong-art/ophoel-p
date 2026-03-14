import * as fs from 'node:fs';
import { LexerTester } from './tester.cjs';
import { TestResult, TestState } from '../../test-resources/test-result.cjs';
(async () => {
    try {
        const result = await new LexerTester().test();
        fs.writeFileSync("./tests/compiler/test-lexer.json", JSON.stringify(result, null, 2), "utf-8");
        console.log(`Test ${result.state === TestState.Success ? "succeed" : "failed"}. ${TestResult.getCoverageMark(result.children)}`);
        console.log("Tested compiler and reported the result in home/tests/compiler/test-lexer.json.");

    } catch (err) {
        const result = TestResult.error(err);
        fs.writeFileSync("./tests/compiler/test-lexer.json", JSON.stringify(result, null, 2), "utf-8");
        console.log(`An error occured during test.`);
        console.log("Tested compiler and reported the result in home/tests/compiler/test-lexer.json.");
    }



})();