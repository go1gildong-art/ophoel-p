import { Parser } from "./parser.cjs";


type ParserOption = {};

export class ExpressionParser extends Parser<ParserOption> {
    
    parse() {}

    boolLiteral() {}
    intLiteral() {}
    floatLiteral() {}
    stringLiteral() {}
    templateStringLiteral() {}
    vectorLiteral() {}
    compoundLiteral() {}
    
    unary() {}
    binary() {}
    indexAccess() {}
    memberAccess() {}

    identifier() {}

    fnCall() {}
    macroCall() {}
}
