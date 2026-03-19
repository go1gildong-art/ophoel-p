import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Hello World",
    description: "Simple ",
    fileName: "test_hello-world.cts",

    source: `say!! "Hello world!";`,
    expectation: `(Program (McCommand "say" (StringLiteral "Hello, World!")))`
});