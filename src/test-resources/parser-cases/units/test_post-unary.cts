import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Post-Unary Operators",
    description: "Post-unary operators ++ -- should parse correctly as postfix.",
    fileName: "test_post-unary.cts",

    source: [
        `const a = x++;`,
        `const b = y--;`
    ].join("\n"),

    expectation: `(program (const a (x ++)) (const b (y --)))`
});