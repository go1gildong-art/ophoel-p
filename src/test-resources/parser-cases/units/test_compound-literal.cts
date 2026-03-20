import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Compound Literal",
    description: "Parser should recognize compound (object-like) literals.",
    fileName: "test_compound-literal.oph",

    source: `const c = {x: 1, y: 2};`,
    expectation: `(program (const c ((x 1) (y 2))))`
});