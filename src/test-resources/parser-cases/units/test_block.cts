import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Block Statement",
    description: "Block with multiple statements should parse correctly.",
    fileName: "test_block.cts",

    source: [
        `{`,
        `  const x = 1;`,
        `  say!! "hello";`,
        `}`
    ].join("\n"),

    expectation: `(program (block ((const x 1) (say!! 'hello'))))`
});