import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "If Statement",
    description: "Simple if statement should parse correctly.",
    fileName: "test_if_statement.cts",

    source: `if true say!! "hello";`,

    expectation: `(program (if true (say!! 'hello')))`
});