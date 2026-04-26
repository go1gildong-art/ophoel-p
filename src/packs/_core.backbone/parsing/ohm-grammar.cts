export const grammar = `
Program = Statement* end

Block = "{" (Statement | YieldExpr )* "}"
YieldExpr = Expr

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
`;
