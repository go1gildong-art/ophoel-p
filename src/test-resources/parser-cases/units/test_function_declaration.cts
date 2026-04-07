import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Function  & Macro Declaration",
    description: "Function & Macro declaration with parameters and body should parse correctly.",
    fileName: "test_function_declaration.cts",
    link: __dirname,

    source: [
        `fn add(a, b) {`,
        `  return a + b;`,
        `}`,
        `macro! log(msg) {`,
        `  say!! msg;`,
        `}`
    ].join("\n"),

    expectation: `(program (fn add (a b) (block ((return (+ a b))))) (macro! log (msg) (block ((say!! msg)))))`
});