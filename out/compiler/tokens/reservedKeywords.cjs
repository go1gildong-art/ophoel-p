"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KW_DECL = [
    "struct",
    "fn",
    "macro",
    "let",
    "const"
];
const KW_CONTROL = [
    "if",
    "else",
    "while",
    "for",
    "repeat",
    "choose",
    "or"
];
const KW_OPHOEL = [
    "mc_exec"
];
const KW_MCCOMMAND = [
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
];
const reservedKeywords = {
    KW_DECL,
    KW_CONTROL,
    KW_MCCOMMAND,
    KW_OPHOEL
};
//# sourceMappingURL=reservedKeywords.cjs.map