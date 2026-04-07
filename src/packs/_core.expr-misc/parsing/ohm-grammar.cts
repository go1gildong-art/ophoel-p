export const grammar = `
ident = letter (letter | digit | "_")*
ParenExpr = "(" Expr ")" -- paren
  | Primary
`;
