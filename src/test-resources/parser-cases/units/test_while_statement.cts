import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "While Statement",
    description: "While loop should parse correctly.",
    fileName: "test_while_statement.cts",

    source: `while i < 10 i++;`,

    expectation: `(program (while (< i 10) (execute (i ++))))`
});