"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_cjs_1 = require("./parser.cjs");
const code = `
inject hello world;
10 + + 10;
`;
try {
    const ast = (0, parser_cjs_1.parseDSL)(code, "test.dsl");
    console.log("AST successfully generated:");
    console.log(JSON.stringify(ast, null, 2));
}
catch (e) {
    // throw e;
    if (e instanceof Error)
        console.error(e.message);
    else
        throw e;
}
//# sourceMappingURL=index.cjs.map