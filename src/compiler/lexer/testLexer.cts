import { Token } from "../tokens/token.cjs";
import { CodeLexer } from "./codeLexer.cjs";


const sources = [
    "let x = 0;"
];

const results = [

]

const testLexer = new CodeLexer(sources[0], "test.oph");
console.log(testLexer.tokenize());