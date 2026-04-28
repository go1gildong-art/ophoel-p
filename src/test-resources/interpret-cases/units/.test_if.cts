import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "If",
    description: "if, used as expressions and statements",
    ophoelDir: "test_if.oph",
    link: __dirname,

    source: [
        `const cond = if true { "it's true!" } else { "it's false!" }`,
        `macro iron_or_gold!(x) {`,
        `  if x == 'iron' { 'an iron!' }`,
        `  elif x == 'gold' { 'a gold!' }`,
        `  elif x == 'emerald' { 'an emerald!' }`,
        `  else { error!! 'neither!'; 'it's neither!' }`,
        `}`,
        ``,
        `say!! cond;`,
        `say!! iron_or_gold!('gold');`,
        `say!! iron_or_gold!('aaaaaaaa')`,
    ].join("\n"),

    expectation: [
        `/say it's true!`,
        `/say a gold!`,
        `/error neither!`,
        `/say it's neither!`
    ].join("\n")
});