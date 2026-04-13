import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Logic Operators",
    description: "Logical pipeline with && and || should parse with correct precedence.",
    ophoelDir: "test-logic.cts",
    link: __dirname,

    source: `const a = true && false || true;`,
    expectation: `(program (const a (|| (&& true false) true)))`
});