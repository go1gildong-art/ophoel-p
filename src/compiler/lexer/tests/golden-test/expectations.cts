
export const expectations = [
    [
        `KW_DECL "let" test.oph:1:1 (0)`,
        `IDENTIFIER "x" test.oph:1:5 (1)`,
        `EQUAL "=" test.oph:1:7 (2)`,
        `NUMBER "0" test.oph:1:9 (3)`,
        `SEMICOLON ";" test.oph:1:10 (4)`
    ],
    [
        `KW_DECL "let" test.oph:1:1 (0)`,
        `IDENTIFIER "variable" test.oph:1:5 (1)`,
        `EQUAL "=" test.oph:1:14 (2)`,
        `NUMBER "0" test.oph:1:16 (3)`,
        `SEMICOLON ";" test.oph:1:17 (4)`
    ],
    [
        `KW_DECL "struct" test.oph:1:1 (0)`,
        `IDENTIFIER "foo" test.oph:1:8 (1)`
    ],
    [
        `KW_DECL "let" test.oph:1:1 (0)`,
        `IDENTIFIER "x" test.oph:1:5 (1)`,
        `EQUAL "=" test.oph:1:7 (2)`,
        `NUMBER "10" test.oph:1:9 (3)`,
        `SEMICOLON ";" test.oph:1:11 (4)`,
        `KW_DECL "let" test.oph:2:1 (5)`,
        `IDENTIFIER "y" test.oph:2:5 (6)`,
        `EQUAL "=" test.oph:2:7 (7)`,
        `NUMBER "20" test.oph:2:9 (8)`,
        `SEMICOLON ";" test.oph:2:11 (19)`
    ],
];