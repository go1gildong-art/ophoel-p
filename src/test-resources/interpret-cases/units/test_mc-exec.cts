import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Minecraft Execute",
    description: "execute scope chain",
    ophoelDir: "test_mc-exec.oph",
    link: __dirname,

    source: [
        `macro say_as_all(msg) {`,
        `  execute "as @a at @s" { say!! msg; }`,
        `}`,
        ``,
        `execute "if entity @s zombie" {`,
        `  say_as_all!("zombies!");`,
        `}`
    ].join("\n"),

    expectation: [
        `/execute if entity @s zombie as @a at @s run say zombies!`
    ].join("\n")
});