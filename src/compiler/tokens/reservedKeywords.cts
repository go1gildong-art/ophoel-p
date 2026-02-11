
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

const KW_MCCOMMAND: Array<string> = [
    "attribute",
    "give",
    "kill",
    "say",
    "tellraw",
    "function",
    "scoreboard",
    "fill",
    "setblock",
    "playsound",
    "clear",
    "place",
    "summon"
]

const reservedKeywords = {
    KW_DECL,
    KW_CONTROL,
    KW_MCCOMMAND,
    KW_OPHOEL
}
