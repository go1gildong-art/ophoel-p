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
        `  repeat_check++;`,
        `  repeat(2) say!! "nested!";`,
        `}`
    ].join("\n"),

    expectation: [
        `/say 1`,
        `/say nested!`,
        `/say nested!`,
        `/say 2`,
        `/say nested!`,
        `/say nested!`,
        `/say 3`,
        `/say nested!`,
        `/say nested!`,
    ].join("\n")
});