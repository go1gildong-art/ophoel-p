export const grammar = `

Expr = VariableAssign

VariableAssign = Expr "=" Expr -- assign
              | CompoundAssign

CompoundAssign = Expr ("+=" | "-=" | "*=" | "/=" | "%=") Expr -- assign
              | OrExp

OrExp = OrExp "||" AndExp  -- or
      | AndExp

AndExp = AndExp "&&" CompareExp  -- and
       | CompareExp

CompareExp = AddExp "==" AddExp  -- eq
           | AddExp "!=" AddExp  -- neq
           | AddExp ">=" AddExp  -- gte
           | AddExp "<=" AddExp  -- lte
           | AddExp ">" AddExp  -- gt
           | AddExp "<" AddExp  -- lt
           | AddExp

AddExp = AddExp "+" MulExp  -- plus
       | AddExp "-" MulExp  -- minus
       | MulExp

MulExp = MulExp "*" UnaryExp  -- multiply
       | MulExp "/" UnaryExp  -- divide
       | MulExp "%" UnaryExp  -- remainder
       | UnaryExp

UnaryExp = "++" UnaryExp  -- preIncrement
         | "--" UnaryExp  -- preDecrement
         | "!" UnaryExp  -- preNot
         | PostUnaryExp

PostUnaryExp = PostUnaryExp "++"  -- postIncrement
             | PostUnaryExp "--"  -- postDecrement
             | IndexAccess


IndexAccess = IndexAccess "[" Expr "]" -- index
              | MemberAccess

MemberAccess = IndexAccess "." ident -- mem
              | FunctionCall

FunctionCall = ident "(" ListOf<Expr, ","> ")" -- fn
              | MacroCall

MacroCall = ident "!" "(" ListOf<Expr, ","> ")" -- macro
              | LambdaLiterals

LambdaLiterals = 
       MacroLiteral
       // | FunctionLiteral
       | ParenExpr

Primary = MacroLiteral
        | number
        | string
        | TemplateString
        | bool
        | FunctionCall
        | MacroCall
        | ident
        | VectorLiteral
        | CompoundLiteral
        | VariableAssign
`;
