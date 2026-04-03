import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Multi chaining",
    description: "complicated multi chaining of . and []",
    fileName: "test_multi-chaining.cts",

    source: [
        `const x = config.a.b.c[0].d[1].e.f[g.h]`
    ].join("\n"),

    expectation: `(program (const (identifier 'x') (member_access (member_access (member_access (index_access (member_access (member_access (identifier 'config') 'a') 'b') 'c') 0) 'd') 1)))`
});