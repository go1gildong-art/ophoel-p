import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "McExec Statement",
    description: "mc_exec statement having prefix and block.",
    ophoelDir: "test_mc-exec.cts",
    link: __dirname,

    source: [
        `execute "as @e"!! {`,
        `  say!! "hello";`,
        `  execute "at @s"!! {`,
        `    say!! "nested";`,
        `  }`,
        `}`
    ].join("\n"),

    expectation: `(program (execute 'as @e'!! (block ((say!! 'hello') (execute 'at @s'!! (block ((say!! 'nested'))))))))`
});