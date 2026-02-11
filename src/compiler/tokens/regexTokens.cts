
const Comments = {
  SLINECOMMENT: /^\/\/.*/, // // comment
  MLINECOMMENT: /^\/\*[\s\S]*?\*\//, // /* comment */
  PRESERVEDCOMMENT: /^\/\/.*/, // /# comment
  PRESERVEDNEWLINE: /^\/\.\n/ // /.
};

const CompoundAssigns = {
  PLUSCASSIGN: /^\+=/, // +=
  MINUSCASSIGN: /^\-=/, // -=
  MULTIPLYCASSIGN: /^\*=/, // *=
  DIVIDECASSIGN: /^\/=/, // /=
  REMAINDERCASSIGN: /^\%=/ // %=
}

const Operations = {
  PLUS: /^\+/, // +
  MINUS: /^\-/, // -
  MULTIPLY: /^\*/, // *
  DIVIDE: /^\//, // /
  REMAINDER: /^\%/, // %
}

const Comparisons = {
  EQUAL: /^==/, // ==
  LESS: /^\</, // <
  OVER: /^\>/, // >
  EQLESS: /^\<=/, // <=
  EQOVER: /^\>=/, // >=
  AND: /^&&/, // &&
  OR: /^\|\|/ // ||
}

const Brackets = {
  LPAREN: /^\(/, // (
  RPAREN: /^\)/, // )
  LBRACKET: /^\[/, // [
  RBRACKET: /^\]/, // ]
  LBRACE: /^\{/, // {
  RBRACE: /^\}/ // }
}

const OphoelSpecial = {
  DOUBLEBANG: /^!!/
  // CONFIGREF: /^config(\.[A-Za-z_][A-Za-z_0-9]*|\[.+\])/ // config.foo.bar[2][baz]...
}

const Symbols = {
  BANG: /^!/,
  CARET: /^\^/,
  DOLLAR: /^\$/,
  AT: /^@/,
  HASH: /^#/,
  DQUOTE: /^"/,
  SQUOTE: /^'/,
  BACKTICK: /^`/,
  ASTERISK: /^\*/,
  PERIOD: /^\./,
  QUESTION: /^\?/,
  SLASH: /\//,
  BACKSLASH: /\\/,
  EQUAL: /^=/,
  DASH: /^-/,
  UNDERSCORE: /^_/,
  COMMA: /^,/,
  COLON: /^:/,
  SEMICOLON: /^;/
}

const Literals = {
  STRING: /^".*"/, // "string"
  BOOL: /^(true|false)/, // true | false
  NUMBER: /^-?\d+(\.\d+)?/, // 1, -2, 3.5
  NULL: /^null/ // null
}

const IdentifierToken = {
  IDENTIFIER: /^[A-Za-z_][A-Za-z0-9-]*/
}

const regexTokens = {
  ...Comments,
  ...CompoundAssigns,
  ...Comparisons,
  ...OphoelSpecial,
  ...Operations,
  ...Literals,
  ...Brackets,
  ...Symbols,
  ...IdentifierToken
}
