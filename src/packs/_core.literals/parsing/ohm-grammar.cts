export const grammar = `
MacroLiteral = "(" ListOf<ident, ","> ")" "!" "=>" (Block | Expr)

string = ("\\"" (~"\\"" any)* "\\"")
       | ("'" (~"'" any)* "'")

TemplateString = "\`" quasi InterQuasi* "\`"
InterQuasi = Interpol quasi
Interpol = "{" Expr "}"
quasi = (~("\`" | "{") any)*

RangeLiteral = Expr? ".." Expr?

number = digit+
bool = "true" | "false"
VectorLiteral = "[" ListOf<Expr, ","> "]"
Pair = ident ":" Expr
CompoundLiteral = "{|" ListOf<Pair, ","> "|}"
`;
