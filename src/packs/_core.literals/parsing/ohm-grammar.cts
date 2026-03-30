export const grammar = `
string = ("\\"" (~"\\"" any)* "\\"")
       | ("'" (~"'" any)* "'")

TemplateString = "\`" (TemplatePart)* "\`"
TemplatePart = "\${" Expr "}" -- exprPart
             | (~("\`" | "\${") any)+ -- stringPart

number = digit+
bool = "true" | "false"
VectorLiteral = "[" ListOf<Expr, ","> "]"
Pair = ident ":" Expr
CompoundLiteral = "{" ListOf<Pair, ","> "}"
`;
