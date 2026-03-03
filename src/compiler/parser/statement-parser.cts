import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser } from "./parser.cjs";
import { TokenStream } from "../tokens/token-stream.cjs";
import { ASTNode } from "../ast/ast.cjs";
import { OphoelParseError } from "./parse-error.cjs";
import { Token } from "../tokens/token.cjs";

import { ASTCollection } from "../ast/build-ast.cjs";
type ParserOption = {};


type ParseResult = {
    succeed: "YES" | "NO",
    result: ASTNode | undefined
};

export class StatementParser extends Parser<ParserOption> {

    result: ASTNode[] = [];
    emit(ast: ASTNode) { this.result.push(ast); }
    getFailure() { return { succeed: "NO", result: undefined } as ParseResult }
    unwrapProgram(program: Program) { return program.body; }

    parse() {
        const loc = this.peek()?.location ?? new Location("unfound", 1, 1, 1);

        return new Program(
            new Block(this.result, loc),
            loc
        );
    }


    fnDecl() {
        if (!this.check("KW_DECL", "fn")) return this.getFailure();

        const keyword = this.expect("KW_DECL", "fn");
        const fnName = this.expect("IDENTIFIER");
        this.expect("LPAREN");

        const paramNames: Token[] = [];
        while (!this.check("RPAREN")) {
            paramNames.push(this.expect("IDENTIFIER"));
            if (this.check("COMMA")) this.eat();
        }

        this.expect("LBRACE");
        const body = 
            new StatementParser(this.getBetween("LBRACE", "RBRACE"), this.config)
            .parse()
            .body;

        this.expect("RBRACE");

        const node = new ASTCollection.FunctionDecl(
            fnName.value,
            paramNames.map(token => token.value),
            body,
            keyword.location
        );

        return { succeed: "YES", result: node};
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
