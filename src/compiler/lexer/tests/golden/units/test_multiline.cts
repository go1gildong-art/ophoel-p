import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "multiline",
    "variable declaration with multiple lines",
    
    `let x = 0;`
    + `\nlet y = 1;`
    + `\nlet z = 2;`,

    [
        `KW_DECL < let > multiline.oph:1:1 (0)`,
        `IDENTIFIER < x > multiline.oph:1:5 (1)`,
        `EQUAL < = > multiline.oph:1:7 (2)`,
        `NUMBER < 0 > multiline.oph:1:9 (3)`,
        `SEMICOLON < ; > multiline.oph:1:10 (4)`,
        
        `KW_DECL < let > multiline.oph:2:1 (5)`,
        `IDENTIFIER < x > multiline.oph:2:5 (6)`,
        `EQUAL < = > multiline.oph:2:7 (7)`,
        `NUMBER < 0 > multiline.oph:2:9 (8)`,
        `SEMICOLON < ; > multiline.oph:2:10 (9)`,
        
        `KW_DECL < let > multiline.oph:3:1 (10)`,
        `IDENTIFIER < x > multiline.oph:3:5 (11)`,
        `EQUAL < = > multiline.oph:3:7 (12)`,
        `NUMBER < 0 > multiline.oph:3:9 (13)`,
        `SEMICOLON < ; > multiline.oph:3:10 (14)`
    ],
)