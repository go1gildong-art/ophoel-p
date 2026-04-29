import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Choose",
    description: "choose statements, with macro expansion and non deterministic execution",
    ophoelDir: "test_choose.cts",
    link: __dirname,

    source: `choose { say!! "option 1"; } or 2 { say!! "option 2"; } or 3 { say!! "option 3"; }`,

    expectation: `(program (choose (1 (say!! 'option 1')) (2 (say!! 'option 2')) (3 (say!! 'option 3')))`
});