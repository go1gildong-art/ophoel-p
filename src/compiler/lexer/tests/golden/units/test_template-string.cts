import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "template-string",
    "test for handling template strings using `` and inner ${} interpolation",
    
    `let msg = \`John has \${x} apples and \${y + 10} bananas.\`;`,

    [
        "KW_DECL < let > template-string.oph:1:1 (0)",
        "IDENTIFIER < msg > template-string.oph:1:1 (1)",
        "EQUAL < = > template-string.oph:1:1 (2)",
        "BACKTICK < ` > template-string.oph:1:1 (3)",

        "TEMPLATE_PART < John has  > template-string.oph:1:1 (4)",
        "OPENEXPR < ${ > template-string.oph:1:1 (5)",

        "IDENTIFIER < x > template-string.oph:1:1 (6)",

        "RBRACE < } > template-string.oph:1:1 (7)",
        "TEMPLATE_PART <  apples and  > template-string.oph:1:1 (8)",
        "OPENEXPR < ${ > template-string.oph:1:1 (9)",

        "IDENTIFIER < x > template-string.oph:1:1 (10)",
        "PLUS < + > template-string.oph:1:1 (11)",
        "NUMBER < 10 > template-string.oph:1:1 (12)",
        
        "RBRACE < } > template-string.oph:1:1 (13)",        
        "TEMPLATE_PART <  bananas. > template-string.oph:1:1 (14)",

        "BACKTICK < ` > template-string.oph:1:1 (15)",
        "SEMICOLON < ; > template-string.oph:1:1 (16)"
    ]
)