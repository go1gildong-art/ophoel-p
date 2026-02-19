import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "comments",
    "test for // comments, /* multiline comments */, /# preserved comments, /. preserved newlines ",
    
    `// this is a comment`
    + `\n/* this is a multi`
    + `\n-line comment /*`
    + `\n/# this is a preserved comment`
    + `\n/.`
    + `\n/* below are all inside one mutli line comment:`
    + `\n// single!`
    + `\n/# preserved!`
    + `\n/.`
    + `\n...by here. */`
    + `\nlet x = 0;`

    [
        `SLINECOMMENT < // this is a comment > comments.oph:1:1 (0)`,
        `MLINECOMMENT < /* this is a multi\n-line comment > comments.oph:2:1 (1)`,
        `PRESERVEDCOMMENT < /# this is a preserved comment > comments.oph:4:1 (2)`,
        `PRESERVEDNEWLINE < /.\n > comments.oph:5:1 (3)`,
        `MLINECOMMENT < /* below are all inside one multi line comment:\n// single!\n/# preserved!\n/.\n...by here. */ > comments.oph:6:1 (4)`,
        
        `KW_DECL < let > comments.oph:11:1 (5)`,
        `IDENTIFIER < x > comments.oph:11:5 (6)`,
        `EQUAL < = > comments.oph:11:7 (7)`,
        `NUMBER < 0 > comments.oph:11:9 (8)`,
        `SEMICOLON < ; > comments.oph:11:10 (9)`
    ]
)