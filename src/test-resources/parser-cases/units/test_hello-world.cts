import { ParserUnit } from "../unit.cjs";

export const HelloWorld = new ParserUnit({
    title: "Hello World",
    description: "Simple ",
    fileName: "test_hello-world.cts",

    source: `say!! "Hello, World!";`,
    expectation: `(Program (McCommand "say" (StringLiteral "Hello, World!")))`
});