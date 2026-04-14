import { CodegenUnit } from "../unit.cjs";

export const unit = new CodegenUnit({
    title: "Fundamentals",
    description: "data structures, repeat, arithmetics, and string interpolation",
    ophoelDir: "test_fundamentals.oph",
    link: __dirname,

    source: [
        `const items = ["diamond", "emerald", "gold_ingot"];`,
        `const counts = [1, 2, 3];`,
        `const i = 0;`,
        `repeat(items.length) {`,
        `  const processed_count = 1 + counts[i] * 100;`,
        `  give!! \`@p {items[i]} {processed_count}\`;`,
        `  foooo = 10;`,
        `  i++;`,
        `}`
    ].join("\n"),

    expectation: [
        `give @p diamond 101`,
        `give @p emerald 201`,
        `give @p gold_ingot 301`
    ].join("\n")
});