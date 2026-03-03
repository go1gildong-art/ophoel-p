import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser } from "./parser.cjs";
import { TokenStream } from "../tokens/token-stream.cjs";
import { ASTNode } from "../ast/ast.cjs";
import { OphoelParseError } from "./parse-error.cjs";
import { Token } from "../tokens/token.cjs";

import { ASTCollection } from "../ast/build-ast.cjs";
import { ExpressionParser } from "./expression-parser.cjs";
import { AssertionError } from "assert";
import { BinaryOperator } from "../ast/expressions/operations.cjs";
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

        return { succeed: "YES", result: node };
    }

    macroDecl() {
        if (!this.check("KW_DECL", "macro")) return this.getFailure();

        const keyword = this.expect("KW_DECL", "macro");
        const macroName = this.expect("IDENTIFIER");
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

        const node = new ASTCollection.MacroDecl(
            macroName.value,
            paramNames.map(token => token.value),
            body,
            keyword.location
        );

        return { succeed: "YES", result: node };
    }

    variableDecl() {
        if (!this.check("KW_DECL", "let") && !this.check("KW_DECL", "const")) return this.getFailure();

        const keyword = this.expect("KW_DECL");
        const mutability = keyword.is("KW_DECL", "const");
        const varName = this.expect("IDENTIFIER");
        this.expect("EQUAL");
        const expression = new ExpressionParser(
            this.getUntil("SEMICOLON"),
            this.config
        ).parse();
        this.expect("SEMICOLON");

        const node = new ASTCollection.VariableDecl(
            varName.value,
            mutability,
            expression,
            keyword.location
        );

        return { succeed: "YES", result: node };
    }

    variableAssign() {
        if (!this.check("IDENTIFIER")) return this.getFailure();

        let nextEqualIndex =
            this.getTail()
                .findIndex(token =>
                    token.is("EQUAL")
                    || token.is("PLUSCASSIGN")
                    || token.is("MINUSCASSIGN")
                    || token.is("MULTIPLYCASSIGN")
                    || token.is("DIVIDECASSIGN")
                    || token.is("REMAINDERCASSIGN"));

        nextEqualIndex = nextEqualIndex !== -1 ? nextEqualIndex : this.getTail().length();

        const address = new ExpressionParser(
            this.getTail().slice(0, nextEqualIndex),
            this.config
        ).parse();

        if (this.check("EQUAL")) {
            this.eat();
            const expression = new ExpressionParser(
                this.getUntil("SEMICOLON"),
                this.config
            ).parse();
            this.expect("SEMICOLON");

            const node = new ASTCollection.VariableAssign(
                address,
                expression,
                address.location
            )
        } else {
            const compoundOper = this.eat();
            const operator: BinaryOperator =

                compoundOper?.is("PLUSCASSIGN") ? BinaryOperator.ADD :
                compoundOper?.is("MINUSCASSIGN") ? BinaryOperator.SUBTRACT :
                compoundOper?.is("MULTIPLYCASSIGN") ? BinaryOperator.MULTIPLY :
                compoundOper?.is("DIVIDECASSIGN") ? BinaryOperator.DIVIDE :
                compoundOper?.is("REMAINDERCASSIGN") ? BinaryOperator.REMAINDER :


                                    new ASTCollection.CompoundAssign()

        }

        this.expect("EQUAL");

        const
        const node = new ASTCollection.VariableAssign()

        return { succeed: "YES", result: node };
    }

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
