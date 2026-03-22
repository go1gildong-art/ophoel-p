import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "McExec Statement",
    description: "mc_exec statement having prefix and block.",
    fileName: "test_mc-exec.cts",

    source: [
        `mc_exec "as @e"!! {`,
        `  say!! "hello";`,
        `  mc_exec "at @s"!! {`,
        `    say!! "nested";`,
        `  }`,
        `}`
    ].join("\n"),

    expectation: `(program (mc_exec 'as @e'!! (block ((say!! 'hello') (mc_exec 'at @s'!! (block ((say!! 'nested'))))))))`
});