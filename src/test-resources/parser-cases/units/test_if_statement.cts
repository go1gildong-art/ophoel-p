import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "If Statement",
    description: "Simple if statement should parse correctly.",
    ophoelDir: "test_if_statement.cts",
    link: __dirname,

    source: `if true say!! "hello";`,

    expectation: `(program (if true (say!! 'hello')))`
});