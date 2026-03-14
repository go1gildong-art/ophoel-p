const KW_DECL: Array<string> = [
    "struct",
    "fn",
    "macro",
    "let",
    "const"
];

const KW_CONTROL: Array<string> = [
    "if",
    "elif",
    "else",
    "while",
    "for",
    "repeat",
    "choose",
    "or"
]

const KW_PREPROCCESS = [
    "include"
]

const KW_OPHOEL: Array<string> = [
    "mc_exec"
]

export const reservedKeywords = {
    KW_DECL,
    KW_CONTROL,
    KW_PREPROCCESS,
    KW_OPHOEL
}
