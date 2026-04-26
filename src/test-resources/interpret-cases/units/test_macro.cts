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
        ``,
        `let mac;`,
        `repeat 1 {`,
        `  const x = 10;`,
        `  mac = (y)! => x + y`, 
        `}`,
        ``,
        `msg!! mac!(20);`,
        `say!! add!("hello, ", "world!");`,
        `twice!(hello);`
        
    ].join("\n"),

    expectation: [
        `/msg 30`,
        `/say hello, world!`,
        `/say hello!`,
        `/say hello!`
    ].join("\n")
});