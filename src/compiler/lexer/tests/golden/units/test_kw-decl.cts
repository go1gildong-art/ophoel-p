import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "kw-decl",
    "sequence of kw-decl specified keywords. none of them on line 1 should be an identifier",
    
    `let const struct fn macro`
    + `\nletx c0nst struc function macro_rules`,

    [
        `KW_DECL < let > multiline.oph:1:1 (0)`,
        `KW_DECL < const > multiline.oph:1:5 (1)`,
        `KW_DECL < struct > multiline.oph:1:11 (2)`,
        `KW_DECL < fn > multiline.oph:1:18 (3)`,
        `KW_DECL < macro > multiline.oph:1:21 (4)`,
        
        `IDENTIFIER < letx > multiline.oph:2:1 (5)`,
        `IDENTIFIER < c0nst > multiline.oph:2:6 (6)`,
        `IDENTIFIER < struc > multiline.oph:2:12 (7)`,
        `IDENTIFIER < function > multiline.oph:2:18 (8)`,
        `IDENTIFIER < macro_rules > multiline.oph:2:27 (9)`
    ]
)