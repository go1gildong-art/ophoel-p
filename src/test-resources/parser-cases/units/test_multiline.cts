import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Multiline",
    description: "Program with multiple statements.",
    ophoelDir: "test_multiline.oph",
    link: __dirname,

    source: [
        `say!! 'Line 1';`,
        `w!! 'Line 2';`,
        `msg!! 'Line 3';`
    ].join("\n"),

    expectation: `(program (say!! 'Line 1') (w!! 'Line 2') (msg!! 'Line 3'))`
});