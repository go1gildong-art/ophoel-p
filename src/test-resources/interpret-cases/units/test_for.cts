import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "For and Ranges",
    description: "for, foreach, and range expressions",
    ophoelDir: "test_for.oph",
    link: __dirname,

    source: [
        `const items = ['diamond', 'gold_ingot' ,'emerald'];`,
        `items -> item, i {`,
        `  give!! \`@p {item}\`;`,
        `}`,
        ``,
        `0..9 -> i {
            say!! i;`,
        `}`,
    ].join("\n"),

    expectation: [
        `/give @p diamond`,
        `/give @p gold_ingot`,
        `/give @p emerald`,
        `/say 0`,
        `/say 1`,
        `/say 2`,
        `/say 3`,
        `/say 4`,
        `/say 5`,
        `/say 6`,
        `/say 7`,
        `/say 8`,
        `/say 9`
    ].join("\n")
});