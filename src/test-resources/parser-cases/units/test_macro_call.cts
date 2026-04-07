import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Macro Calls",
    description: "Macro calls with ! syntax and various argument counts should parse correctly.",
    fileName: "test_macro_call.cts",
    link: __dirname,

    source: [
        `const a = foo!();`,
        `const b = bar!(1);`,
        `const c = baz!(1, 2, 3);`
    ].join("\n"),

    expectation: `(program (const a (foo! )) (const b (bar! 1)) (const c (baz! 1 2 3)))`
});