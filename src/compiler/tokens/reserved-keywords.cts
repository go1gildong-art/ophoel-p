const KW_DECL: Array<string> = [
    "struct",
    "fn",
    "macro",
    "let",
    "const"
];

const KW_CONTROL: Array<string> = [
    "if",
    "else",
    "while",
    "for",
    "repeat",
    "choose",
    "or"
]

const KW_OPHOEL: Array<string> = [
    "mc_exec"
]

export const reservedKeywords = {
    KW_DECL,
    KW_CONTROL,
    KW_OPHOEL
}
