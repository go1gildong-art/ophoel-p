import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser } from "./parser.cjs";


type ParserOption = {};

export class StatementParser extends Parser<ParserOption> {

    parse() { 
        return new Program(new Block([], new Location("e", 1, 1, 1)), new Location("e", 1, 1, 1)) 
    }

    fnDecl() { }
    macroDecl() { }
    structDecl() { }
    variableDecl() { }
    variableAssign() { }

    choose() { }
    if() { }
    for() { }
    mcCommand() { }
    mcExec() { }
    repeat() { }
    while() { }

    fnCall() { }
    macroCall() { }

    include() { }

}
