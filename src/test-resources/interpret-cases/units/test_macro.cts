import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Macro",
    description: "macro decl and call by traditional macro and literal obj. also includes high order",
    ophoelDir: "test-macro.oph",
    link: __dirname,

    source: [
        `const add = (a, b)! => { a + b };`,
        `const hello = ()! => { say!! "hello!"; };`,
        `const twice = (c)! => { c!(); c!(); };`,

        `say!! add!("hello, ", "world!");`,
        `twice!(hello);`
        
    ].join("\n"),

    expectation: [
        `/say hello, world!`,
        `/say hello!`,
        `/say hello!`
    ].join("\n")
});