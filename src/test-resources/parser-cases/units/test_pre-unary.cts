import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Pre-Unary Operators",
    description: "Pre-unary operators ++ -- ! should parse correctly as prefix.",
    fileName: "test_pre-unary.cts",

    source: [
        `const a = ++x;`,
        `const b = --y;`,
        `const c = !true;`
    ].join("\n"),

    expectation: `(program (const a (++ x)) (const b (-- y)) (const c (! true)))`
});