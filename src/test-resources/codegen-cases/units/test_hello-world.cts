import { CodegenUnit } from "../unit.cjs";

export const unit = new CodegenUnit({
    title: "Hello World",
    description: "again, hello world.",
    ophoelDir: "test-hello_world.oph",
    link: __dirname,

    source: `say!! "Hello, world!";`,
    expectation: `say Hello, world!`
});