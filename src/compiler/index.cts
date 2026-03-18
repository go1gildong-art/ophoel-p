import { parse } from './parser.cjs';

const code = `
say!! "Hello, World!";
10 + 10;
`;

try {
    const ast = parse(code, "test.dsl");
    console.log("AST successfully generated:");
    console.log(JSON.stringify(ast, null, 2));
} catch (e) {
    // throw e;
    if (e instanceof Error) console.error(e.message);
    else throw e;
}