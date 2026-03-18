import { ParserGolden } from "../itnerface.cjs";

export const HelloWorld = new ParserGolden({
    title: "Hello World",
    description: "Simple ",
    fileName: "test_hello-world.cts",

    source: `say!! "Hello, World!";`,
    expectation: `(Program (McCommand "say" (StringLiteral "Hello, World!")))`
});