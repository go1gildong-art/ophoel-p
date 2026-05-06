import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Repeat",
    description: "repeat statement test with nested repeat",
    ophoelDir: "test_repeat.oph",
    link: __dirname,

    source: [
        `const repeat_check = 1;`,
        `repeat(3) {`,
        `  say!! repeat_check;`,
        `  repeat 2 -> i say!! \`nested! {i}\`;`,
        `  repeat_check++;`,
        `}`
    ].join("\n"),

    expectation: [
        `/say 1`,
        `/say nested! 1`,
        `/say nested! 2`,
        `/say 2`,
        `/say nested! 1`,
        `/say nested! 2`,
        `/say 3`,
        `/say nested! 1`,
        `/say nested! 2`,
    ].join("\n")
});