import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Comparison Operators",
    description: "All comparison ops == != > < >= <= should parse correctly.",
    ophoelDir: "test-comparisons.cts",
    link: __dirname,

    source: [
        `const a = 1 == 2;`,
        `const b = 3 != 4;`,
        `const c = 5 > 6;`,
        `const d = 7 < 8;`,
        `const e = 9 >= 10;`,
        `const f = 11 <= 12;`
    ].join("\n"),

    expectation: `(program (const a (== 1 2)) (const b (!= 3 4)) (const c (> 5 6)) (const d (< 7 8)) (const e (>= 9 10)) (const f (<= 11 12)))`
});