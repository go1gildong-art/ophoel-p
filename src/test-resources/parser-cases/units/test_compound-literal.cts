import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Compound Literal",
    description: "Parser should recognize compound (object-like) literals.",
    ophoelDir: "test_compound-literal.oph",
    link: __dirname,

    source: `const c = {x: 1, y: 2};`,
    expectation: `(program (const c ((x 1) (y 2))))`
});