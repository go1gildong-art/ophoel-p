import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "For statements",
    description: "For(ForEach too, with -> syntax) statements should parse correctly!!!",
    ophoelDir: "test_for.oph",
    link: __dirname,

    source: [
        `my_arr -> item, idx { say!! item; }`
    ].join("\n"),

    expectation: `(program (my_arr -> (item, idx) (block ((say!! item)))))`
});