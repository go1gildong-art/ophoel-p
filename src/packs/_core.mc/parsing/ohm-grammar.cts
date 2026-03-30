export const grammar = `
McCommand = ident "!!" Expr ";"
McExecStatement = "mc_exec" Expr "!!" Statement
`;