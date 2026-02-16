import * as fs from 'node:fs';
import { LexerTester } from './lexer-tester.cjs';

const result = new LexerTester().test();
fs.writeFileSync("./tests/compiler/test-lexer.json", JSON.stringify(result, null, 2), "utf-8");
console.log("Tested lexer and reported on home/tests/compiler/test-lexer.json.");