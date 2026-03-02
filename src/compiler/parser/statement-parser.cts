import { Parser } from "./parser.cjs";


type ParserOption = {};

export class StatementParser extends Parser<ParserOption> {
    
    parse() {}

    fnDecl() {}
    macroDecl() {}
    structDecl() {}
    variableDecl() {}
    variableAssign() {}
    
    choose() {}
    if() {}
    for() {}
    mcCommand() {}
    mcExec() {}
    repeat() {}
    while() {}

    fnCall() {}
    macroCall() {}

    include() {}

}
