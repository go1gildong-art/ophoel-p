import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "simple-variable",
    "A single line variable declaration",
    
    "let x = 0;",

    [
        `KW_DECL < let > simple-variable.oph:1:1 (0)`,
        `IDENTIFIER < x > simple-variable.oph:1:5 (1)`,
        `EQUAL < = > simple-variable.oph:1:7 (2)`,
        `NUMBER < 0 > simple-variable.oph:1:9 (3)`,
        `SEMICOLON < ; > simple-variable.oph:1:10 (4)`
    ],
)