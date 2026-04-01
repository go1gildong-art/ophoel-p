export const grammar = `
Program = Statement* end

Block = "{" Statement* "}"

ExecExpr = Expr ";"

Statement = Include
           | FunctionDecl
           | MacroDecl
           | IfStatement
           | WhileStatement
           | ForStatement
           | ForOfStatement
           | RepeatStatement
           | ChooseStatement
           | McExecStatement
           | McCommand
           | ConstDecl
           | VariableDecl
           | ReturnStatement
           | ExecExpr
           | Block

  Expr = OrExp
`;
