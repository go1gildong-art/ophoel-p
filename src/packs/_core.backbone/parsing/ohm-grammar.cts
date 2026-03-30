export const grammar = `
Program = Statement* end

Block = "{" Statement* "}"

ReturnStatement = "return" Expr? ";"
`;
