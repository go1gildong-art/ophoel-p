import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "String Interpolation",
    description: "template string interpolation handling",
    fileName: "test_string-interpolation.oph",

    source: [
        `const mob = "minecraft:zombie";`,
        `const coords = "~ ~ ~";`,
        `summon!! \`\${mob} \${coords}\``
    ].join("\n"),

    expectation: [
        `/summon minecraft:zombie ~ ~ ~`
    ].join("\n")
});