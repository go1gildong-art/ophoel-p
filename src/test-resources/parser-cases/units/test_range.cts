import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Range Literal",
    description: "Parses a numeric range literal using .. syntax.",
    ophoelDir: "test_range.oph",
    link: __dirname,

    source: [
        `const x = 10;`,
        `const r = 1..x;`
    ].join("\n"),
        expectation: `(program (const x 10) (const r (1 .. x)))`
});
