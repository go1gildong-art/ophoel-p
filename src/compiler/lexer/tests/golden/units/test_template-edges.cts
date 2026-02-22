import { UnitCase } from "./unit-case.cjs"
export const unit = new UnitCase(
    "template-edges",
    "test for handling edge cases for templates",

    `let msg1 = \`\`;` + "\n" +
    `let msg2 = \`foo\`;` + "\n" +
    `let msg3 = \`a\${"b" + \`\${c}\`}\`;` + "\n" +
    `let msg4 = \`\${bar}\`;`,

    [
        'KW_DECL < let > template-edges.cts:1:1 (0)',
        'IDENTIFIER < msg1 > template-edges.cts:1:5 (1)',
        'EQUAL < = > template-edges.cts:1:10 (2)',
        'BACKTICK < ` > template-edges.cts:1:12 (3)',
        'TEMPLATE_PART <  > template-edges.cts:1:13 (4)',
        'BACKTICK < ` > template-edges.cts:1:13 (5)',
        'SEMICOLON < ; > template-edges.cts:1:14 (6)',

        'KW_DECL < let > template-edges.cts:2:1 (7)',
        'IDENTIFIER < msg2 > template-edges.cts:2:5 (8)',
        'EQUAL < = > template-edges.cts:2:10 (9)',
        'BACKTICK < ` > template-edges.cts:2:12 (10)',
        'TEMPLATE_PART < foo > template-edges.cts:2:13 (11)',
        'BACKTICK < ` > template-edges.cts:2:16 (12)',
        'SEMICOLON < ; > template-edges.cts:2:17 (13)',

        'KW_DECL < let > template-edges.cts:3:1 (14)',
        'IDENTIFIER < msg3 > template-edges.cts:3:5 (15)',
        'EQUAL < = > template-edges.cts:3:10 (16)',
        'BACKTICK < ` > template-edges.cts:3:12 (17)',
        'TEMPLATE_PART < a > template-edges.cts:3:13 (18)',
        'OPENEXPR < ${ > template-edges.cts:3:14 (19)',
        'STRING < "b" > template-edges.cts:3:16 (20)',
        'PLUS < + > template-edges.cts:3:20 (21)',
        'BACKTICK < ` > template-edges.cts:3:22 (22)',
        'TEMPLATE_PART <  > template-edges.cts:3:23 (23)',
        'OPENEXPR < ${ > template-edges.cts:3:23 (24)',
        'IDENTIFIER < c > template-edges.cts:3:25 (25)',
        'RBRACE < } > template-edges.cts:3:26 (26)',
        'TEMPLATE_PART <  > template-edges.cts:3:27 (27)',
        'BACKTICK < ` > template-edges.cts:3:27 (28)',
        'RBRACE < } > template-edges.cts:3:28 (29)',
        'TEMPLATE_PART <  > template-edges.cts:3:29 (30)',
        'BACKTICK < ` > template-edges.cts:3:29 (31)',
        'SEMICOLON < ; > template-edges.cts:3:30 (32)',
        
        'KW_DECL < let > template-edges.cts:4:1 (33)',
        'IDENTIFIER < msg4 > template-edges.cts:4:5 (34)',
        'EQUAL < = > template-edges.cts:4:10 (35)',
        'BACKTICK < ` > template-edges.cts:4:12 (36)',
        'TEMPLATE_PART <  > template-edges.cts:4:13 (37)',
        'OPENEXPR < ${ > template-edges.cts:4:13 (38)',
        'IDENTIFIER < bar > template-edges.cts:4:15 (39)',
        'RBRACE < } > template-edges.cts:4:18 (40)',
        'TEMPLATE_PART <  > template-edges.cts:4:19 (41)',
        'BACKTICK < ` > template-edges.cts:4:19 (42)',
        'SEMICOLON < ; > template-edges.cts:4:20 (43)'
    ]
)