import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser } from "./parser.cjs";
import { ASTCollection } from "../ast/build-ast.cjs";
import { TokenStream } from "../tokens/token-stream.cjs";
import { ASTNode } from "../ast/ast.cjs";
import { OphoelParseError } from "./parse-error.cjs";


type ParserOption = {};


type ParseResult = {
    succeed: "YES" | "NO",
    result: ASTNode | undefined
};

export class StatementParser extends Parser<ParserOption> {

    resultAst = new ASTCollection.Program (
        new ASTCollection.Block([], this.peek().location),
        this.peek().location
    )

    emit(ast: ASTNode) { this.resultAst.body.statements.push(ast); }
    getFailure() { return {succeed: "NO", result: undefined} as ParseResult }


    parse() { 
        return new Program(new Block([], new Location("e", 1, 1, 1)), new Location("e", 1, 1, 1)) 
    }

    fnDecl() {
        if (!this.peek()?.is("KW_DECL", "fn")) return this.getFailure();
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
