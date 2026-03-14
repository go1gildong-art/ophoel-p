"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexTokens = void 0;
const Whitespace = {
    WHITESPACE: /^\s+/
};
const Comments = {
    SLINECOMMENT: /^\/\/.*/, // // comment
    MLINECOMMENT: /^\/\*[\s\S]*?\*\//, // /* comment */
    PRESERVEDCOMMENT: /^\/#.*/, // /# comment
    PRESERVEDNEWLINE: /^\/\.\n/ // /.
};
const CompoundAssigns = {
    PLUSCASSIGN: /^\+=/, // +=
    MINUSCASSIGN: /^\-=/, // -=
    MULTIPLYCASSIGN: /^\*=/, // *=
    DIVIDECASSIGN: /^\/=/, // /=
    REMAINDERCASSIGN: /^\%=/ // %=
};
const Operations = {
// PLUS: /^\+/, // +
// MINUS: /^\-/, // -
// MULTIPLY: /^\*/, // *
// DIVIDE: /^\//, // /
// REMAINDER: /^\%/, // %
};
const Comparisons = {
    ISEQUAL: /^==/, // ==
    NOTEQUAL: /^!=/, // !=
    LESS: /^\</, // <
    OVER: /^\>/, // >
    EQLESS: /^\<=/, // <=
    EQOVER: /^\>=/, // >=
    AND: /^&&/, // &&
    OR: /^\|\|/ // ||
};
const Brackets = {
    LPAREN: /^\(/, // (
    RPAREN: /^\)/, // )
    LBRACKET: /^\[/, // [
    RBRACKET: /^\]/, // ]
    LBRACE: /^\{/, // {
    RBRACE: /^\}/ // }
};
const OphoelSpecial = {
    DOUBLEBANG: /^!!/
    // CONFIGREF: /^config(\.[A-Za-z_][A-Za-z_0-9]*|\[.+\])/ // config.foo.bar[2][baz]...
};
const TemplateString = {
    OPENEXPR: /^\$\{/
};
const DoubleOperators = {
    DOUBLEPLUS: /^\+\+/,
    DOUBLEDASH: /^\-\-/
};
const Symbols = {
    PLUS: /^\+/, // +
    DASH: /^\-/, // -
    ASTERISK: /^\*/, // *
    SLASH: /^\//, // /
    PERCENT: /^\%/, // %
    BANG: /^!/,
    CARET: /^\^/,
    DOLLAR: /^\$/,
    AT: /^@/,
    HASH: /^#/,
    DQUOTE: /^"/,
    SQUOTE: /^'/,
    BACKTICK: /^`/,
    PERIOD: /^\./,
    QUESTION: /^\?/,
    BACKSLASH: /\\/,
    EQUAL: /^=/,
    UNDERSCORE: /^_/,
    COMMA: /^,/,
    COLON: /^:/,
    SEMICOLON: /^;/
};
const Literals = {
    STRING: /^".*"/, // "string"
    BOOL: /^(true|false)/, // true | false
    NUMBER: /^-?\d+(\.\d+)?/, // 1, -2, 3.5
    NULL: /^null/ // null
};
const KeywordToken = {
    KEYWORD: /^[A-Za-z_][A-Za-z0-9-_]*/
};
exports.regexTokens = {
    ...Whitespace,
    ...Comments,
    ...CompoundAssigns,
    ...Comparisons,
    ...OphoelSpecial,
    ...TemplateString,
    ...Operations,
    ...Literals,
    ...Brackets,
    ...DoubleOperators,
    ...Symbols,
    ...KeywordToken
};
//# sourceMappingURL=regex-tokens.cjs.map