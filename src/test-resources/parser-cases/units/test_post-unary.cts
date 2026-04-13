import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Post-Unary Operators",
    description: "Post-unary operators ++ -- should parse correctly as postfix.",
    ophoelDir: "test_post-unary.cts",
    link: __dirname,

    source: [
        `const a = x++;`,
        `const b = y--;`
    ].join("\n"),

    expectation: `(program (const a (x ++)) (const b (y --)))`
});