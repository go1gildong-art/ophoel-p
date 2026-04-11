export const grammar = `
string = ("\\"" (~"\\"" any)* "\\"")
       | ("'" (~"'" any)* "'")

TemplateString = "\`" quasi InterQuasi* "\`"

InterQuasi = Interpol quasi
Interpol = "{" Expr "}"
quasi = (~("\`" | "{") any)*



number = digit+
bool = "true" | "false"
VectorLiteral = "[" ListOf<Expr, ","> "]"
Pair = ident ":" Expr
CompoundLiteral = "{" ListOf<Pair, ","> "}"
`;
