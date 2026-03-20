import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Function Calls",
    description: "Function calls with various argument counts should parse correctly.",
    fileName: "test_function_call.cts",

    source: [
        `const a = foo();`,
        `const b = bar(1);`,
        `const c = baz(1, 2, 3);`
    ].join("\n"),

    expectation: `(program (const a (foo )) (const b (bar 1)) (const c (baz 1 2 3)))`
});