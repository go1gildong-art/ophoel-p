import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Hello World",
    description: "Simple ",
    fileName: "test_hello-world.oph",
    link: __dirname,

    source: `say!! "Hello world!";`,
    expectation: `(program (say!! 'Hello world!'))`
});