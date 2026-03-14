import { parseDSL } from './parser.cjs';

const code = `
"hello world";
10 + 20
`;

try {
    const ast = parseDSL(code, "test.dsl");
    console.log("AST successfully generated:");
    console.log(JSON.stringify(ast, null, 2));
} catch (e) {
    if (e instanceof Error) console.error(e.message);
    else throw e;
}