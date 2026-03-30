export const grammar = `
VariableAssign = ident "=" Expr
CompoundAssign = ident ("+=" | "-=" | "*=" | "/=" | "%=") Expr
ident = letter (letter | digit | "_")*
ParenExpr = "(" Expr ")"
`;
