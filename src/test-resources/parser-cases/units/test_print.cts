import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Print",
    description: "print statements that log inside compiler",
    ophoelDir: "test_print.oph",
    link: __dirname,

    source: [
        `const a = 10;`,
        `print! a;`
    ].join("\n"),

    expectation: `(program (const a 10) (print a))`
});