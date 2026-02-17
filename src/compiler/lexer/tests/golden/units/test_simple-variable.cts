import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "simple-variable",
    "A single line variable declaration",
    
    "let x = 0;",

    [
        `KW_DECL < let > test.oph:1:1 (0)`,
        `IDENTIFIER < x > test.oph:1:5 (1)`,
        `EQUAL < = > test.oph:1:7 (2)`,
        `NUMBER < 0 > test.oph:1:9 (3)`,
        `SEMICOLON < ; > test.oph:1:10 (4)`
    ],
)