export const grammar = `
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
             | ParenExpr

ParenExpr = "(" Expr ")" -- paren
          | Primary

FunctionCall = ident "(" ListOf<Expr, ","> ")"
MacroCall = ident "!" "(" ListOf<Expr, ","> ")"

Primary = number
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
