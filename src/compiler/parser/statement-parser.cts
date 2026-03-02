import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser } from "./parser.cjs";
import { ASTCollection } from "../ast/build-ast.cjs";
import { TokenStream } from "../tokens/token-stream.cjs";


type ParserOption = {};

export class StatementParser extends Parser<ParserOption> {

    resultAst = new ASTCollection.Program (
        new ASTCollection.Block([], this.peek().location),
        this.peek().location
    )

    constructor(tokens: TokenStream, config: ParserOption) {
        super(tokens, config);
    }

    parse() { 
        return new Program(new Block([], new Location("e", 1, 1, 1)), new Location("e", 1, 1, 1)) 
    }

    fnDecl() {

    }

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
