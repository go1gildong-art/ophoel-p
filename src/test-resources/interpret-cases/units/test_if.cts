import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "If",
    description: "if, used as expressions and statements",
    ophoelDir: "test_if.oph",
    link: __dirname,

    source: [
        `macro iron_or_gold!(x) {`,
        `  yield if (x == 'iron') { 'an iron!' }`,
        `  elif (x == 'gold') { 'a gold!' }`,
        `  elif (x == 'emerald') { 'an emerald!' }`,
        `  else { error!! 'neither!'; "it's neither!" }`,
        `}`,
        ``,
        `if (10 > 20) {`,
        `  say!! "never";`, 
        `} else {`,
        `  say!! "10 is smaller than 20";`,
        `}`,
        `say!! iron_or_gold!('gold');`,
        `say!! iron_or_gold!('aaaaaaaa');`,
    ].join("\n"),

    expectation: [
        `/say 10 is smaller than 20`,
        `/say a gold!`,
        `/error neither!`,
        `/say it's neither!`
    ].join("\n")
});