import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Data structures",
    description: "vectors and compounds",
    fileName: "test_data-structs.oph",

    source: [
        `const myVec = [1, 2, 3];`,
        `const myComp = {`,
        `  x: "foo",`, 
        `  y: "bar",`, 
        `  z: [ 100, 200, 300 ]`,
        `};`,

        `say!! myVec[0];`,
        `say!! myComp.x;`,

        `msg!! myVec[1]++;`,
        `msg!! myVec[1];`,

        `myVec["y"] += " qux";`,
        `msg!! myVec["y"];`,

        `say!! myComp.z[2];`,
    ].join("\n"),

    expectation: [
        `/say 1`,
        `/say "foo"`,
        `/msg 2`,
        `/msg 3`,
        `/msg bar qux`,
        `/say 300`
    ].join("\n")
});