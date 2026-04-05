import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Hello World",
    description: "This is called hello world. please. at least make this one pass.",
    fileName: "test-hello_world.oph",

    source: `say!! "Hello, world!";`,
    expectation: `/say Hello, world!`
});