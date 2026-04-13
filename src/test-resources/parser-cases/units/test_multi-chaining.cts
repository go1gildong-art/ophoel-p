import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Multi chaining",
    description: "complicated multi chaining of . and []",
    ophoelDir: "test_multi-chaining.cts",
    link: __dirname,

    source: [
        `const x = config.a.b[0][1 + 2].c;`
    ].join("\n"),

    expectation: `(program (const x (. ([] ([] (. (. config a) b) 0) (+ 1 2)) c)))`,
});