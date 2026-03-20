import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Multiline",
    description: "Program with multiple statements.",
    fileName: "test_multiline.oph",

    source: [
        `say!! 'Line 1';`,
        `w!! 'Line 2';`,
        `msg!! 'Line 3';`
    ].join("\n"),

    expectation: `(program (say!! 'Line 1') (w!! 'Line 2') (msg!! 'Line 3'))`
});