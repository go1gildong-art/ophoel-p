import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Template Strings",
    description: "Template string literals with backticks should parse correctly.",
    ophoelDir: "test_template_string.cts",
    link: __dirname,

    source: [
        `const a = \`hello world\`;`,
        `const b = \`multiline`,
        `template\`;`,
        `const c = \`John has {1 + 2} apples\`;`
    ].join("\n"),

    expectation: `(program (const a \`hello world\`) (const b \`multiline\ntemplate\`) (const c \`John has {1 + 2} apples\`))`
});