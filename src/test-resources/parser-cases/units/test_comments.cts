import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Comment Parsing",
    description: "Parses single-line and multi-line comments in parser input.",
    ophoelDir: "test_comments.oph",
    link: __dirname,

    source: [
        `const x = 1; //line comment`,
        `/*block comment*/`,
        `/# preserved comment`,
        `/.`,
        `const y = 2;`
    ].join("\n"),
    expectation: `(program (const x 1) (// line comment) (/* block comment */) (/# preserved comment) (/.) (const y 2))`
});
