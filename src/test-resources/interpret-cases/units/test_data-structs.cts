import { InterpretUnit } from "../unit.cjs";

export const unit = new InterpretUnit({
    title: "Data structures",
    description: "vectors and compounds",
    ophoelDir: "test_data-structs.oph",
    link: __dirname,

    source: [
        `const myVec = [1, 2, 3];`,
        `const myComp = {|`,
        `  x: "foo",`, 
        `  y: "bar",`, 
        `  z: [ 100, 200, 300 ]`,
        `|};`,

        `say!! myVec[0];`,
        `say!! myComp.x;`,

        `msg!! myVec[1]++;`,
        `msg!! myVec[1];`,

        `myComp["y"] += " qux";`,
        `msg!! myComp["y"];`,

        `say!! myComp.z[2];`,
    ].join("\n"),

    expectation: [
        `/say 1`,
        `/say foo`,
        `/msg 2`,
        `/msg 3`,
        `/msg bar qux`,
        `/say 300`
    ].join("\n")
});