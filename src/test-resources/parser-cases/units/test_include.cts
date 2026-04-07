import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Include Statement",
    description: "Include preprocess statement should parse correctly.",
    fileName: "test_include.cts",
    link: __dirname,

    source: `include "utils.oph";`,

    expectation: `(program (include utils.oph))`
});