import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Function Declaration",
    description: "Function declaration with parameters and body should parse correctly.",
    fileName: "test_function_declaration.cts",

    source: [
        `fn add(a, b) {`,
        `  a + b;`,
        `}`
    ].join("\n"),

    expectation: `(program (fn add (a b) (block ((+ a b)))))`
});