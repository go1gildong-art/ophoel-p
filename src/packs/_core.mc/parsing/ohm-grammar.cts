export const grammar = `
McCommand = ident "!!" Expr ";"
McExecStatement = "execute" Expr "!!" Statement
`;