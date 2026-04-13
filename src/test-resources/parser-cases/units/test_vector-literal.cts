import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Vector Literal",
    description: "Vector literal, similar with array. will contain multiple expressions inside",
    ophoelDir: "test_vector-literal.oph",
    link: __dirname,

    source: `const v = [1, 'foo', true, 1 + 3];`,
    expectation: `(program (const v (1 'foo' true (+ 1 3))))`
});