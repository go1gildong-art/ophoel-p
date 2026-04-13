import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Hello World",
    description: "This is called hello world. please. at least make this one pass.",
    ophoelDir: "test-hello_world.oph",
    link: __dirname,

    source: `say!! "Hello, world!";`,
    expectation: `/say Hello, world!`
});