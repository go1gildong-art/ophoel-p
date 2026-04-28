export const grammar = `
IfStatement = "if" Expr IfBody Elif* Else?
Elif = "elif" Expr IfBody
Else = "else" IfBody
IfBody = Statement | Expr

WhileStatement = "while" Expr Statement
ForStatement = "for" "(" (VariableDecl | ConstDecl | Expr) Expr ";" Expr ")" Statement
ForOfStatement = "for" "(" (VariableDecl | ConstDecl) "of" Expr ")" Statement
RepeatStatement = "repeat" Expr Statement

ChooseStatement = "choose" Expr Statement ChooseOr*
ChooseOr = "or" Expr Statement

ReturnStatement = "return" Expr? ";"
`;