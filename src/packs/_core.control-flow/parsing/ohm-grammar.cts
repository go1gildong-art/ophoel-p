export const grammar = `
IfStatement = "if" Expr IfBody Elif* Else?
Elif = "elif" Expr IfBody
Else = "else" IfBody
IfBody = Statement | Expr

WhileStatement = "while" Expr Statement
ForStatement = "for" "(" (VariableDecl | ConstDecl | Expr) Expr ";" Expr ")" Statement

ForEachStatement = Expr "->" ident Statement -- standard
                | Expr "->" ident "," ident Statement -- indexed

RepeatStatement = "repeat" Expr Statement -- standard
| "repeat" Expr "->" ident Statement -- indexed

ChooseStatement = "choose" WeightBodySet ("or" WeightBodySet)*
WeightBodySet = Expr Statement -- explicit
                | Statement -- implicit

ReturnStatement = "return" Expr? ";"
`;