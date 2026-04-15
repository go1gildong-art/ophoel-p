export const grammar = `
VariableDecl = "let" ident "=" Expr ";" -- withInit
            | "let" ident ";" -- noInit
ConstDecl = "const" ident "=" Expr ";"
FunctionDecl = "fn" ident "(" ListOf<ident, ","> ")" Block
MacroDecl = "macro" "!" ident "(" ListOf<ident, ","> ")" Block
`;