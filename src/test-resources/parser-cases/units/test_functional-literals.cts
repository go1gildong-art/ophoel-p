import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Macro literal",
    description: "1st class form of macro. similar with arrow function",
    ophoelDir: "test_functional-literals.oph",
    link: __dirname,

    source: [
        `const x = (a, b)! => a + b;`
    ].join("\n"),

    expectation: `(program (const x ((a b)! => (+ a b))))`
});