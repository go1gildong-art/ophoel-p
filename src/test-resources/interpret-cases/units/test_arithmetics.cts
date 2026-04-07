import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Arithmetics",
    description: "simple arithmetics test, with parenthesis and operator precedence",
    fileName: "test-arithmetics.oph",

    source: [
        `const a = 1;`,
        `const b = 2;`,
        `const c = a + b;`,
        `const d = a + 4 / (c - b);`,

        `a!! a;`,
        `b!! b;`,
        `c!! c;`,
        `d!! d;`
    ].join("\n"),

    expectation: [
        `/a 1`,
        `/b 2`,
        `/c 3`,
        `/d 5`
    ].join("\n")
});