import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "template-string",
    "test for handling template strings using `` and inner ${} interpolation",
    
    `let msg = \`John has \${x} apples and \${y + 10} bananas.\`;`,

    [
        "KW_DECL < let > template-string.oph:1:1 (0)",
        "IDENTIFIER < msg > template-string.oph:1:5 (1)",
        "EQUAL < = > template-string.oph:1:9 (2)",
        "BACKTICK < ` > template-string.oph:1:11 (3)",

        "TEMPLATE_PART < John has  > template-string.oph:1:12 (4)",
        "OPENEXPR < ${ > template-string.oph:1:21 (5)",

        "IDENTIFIER < x > template-string.oph:1:23 (6)",

        "RBRACE < } > template-string.oph:1:24 (7)",
        "TEMPLATE_PART <  apples and  > template-string.oph:1:25 (8)",
        "OPENEXPR < ${ > template-string.oph:1:37 (9)",

        "IDENTIFIER < y > template-string.oph:1:39 (10)",
        "PLUS < + > template-string.oph:1:41 (11)",
        "NUMBER < 10 > template-string.oph:1:43 (12)",
        
        "RBRACE < } > template-string.oph:1:45 (13)",        
        "TEMPLATE_PART <  bananas. > template-string.oph:1:46 (14)",

        "BACKTICK < ` > template-string.oph:1:55 (15)",
        "SEMICOLON < ; > template-string.oph:1:56 (16)"
    ]
)