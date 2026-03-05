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
import { BinaryOperator } from "../ast/expressions/operations.cjs";
import { CondBodySet } from "../ast/statements/if.cjs";
type ParserOption = {};


type ParseResult = {
    succeed: "YES" | "NO",
    result: ASTNode | undefined
};

export class StatementParser extends Parser<ParserOption> {

    result: ASTNode[] = [];
    emit(ast: ASTNode) { this.result.push(ast); }
    makeFailure() { return { succeed: "NO", result: undefined } as ParseResult }
    makeSuccess(node: ASTNode) { return { succeed: "YES", result: node } as ParseResult }
    unwrapProgram(program: Program) { return program.body; }

    parseBlock() {
        const startBrace = this.expect("LBRACE");

        const tokens = this.getBetween(
            token => token.is("LBRACE"),
            token => token.is("RBRACE"));

        const body =
            new StatementParser(tokens, this.config)
                .parse()
                .body;

        this.expect("RBRACE");
        const block = new Block(body, startBrace.location);
        return block;
    }

    parseParenExpr() {
        const startParen = this.expect("LPAREN");
        const tokens = this.getBetween(
            token => token.is("LPAREN"),
            token => token.is("RPAREN"));

        const expr =
            new ExpressionParser(tokens, this.config)
                .parse()

        this.expect("RPAREN");
        return expr;
    }

    parse() {
        const loc = this.peek()?.location ?? new Location("unfound", 1, 1, 1);
        return new Program(this.result, loc);
    }


    fnDecl() {
        if (!this.check("KW_DECL", "fn")) return this.makeFailure();

        const keyword = this.expect("KW_DECL", "fn");
        const fnName = this.expect("IDENTIFIER");
        this.expect("LPAREN");

        const paramNames: Token[] = [];
        while (!this.check("RPAREN")) {
            paramNames.push(this.expect("IDENTIFIER"));
            if (this.check("COMMA")) this.eat();
        }

        const body = this.parseBlock();

        const node = new ASTCollection.FunctionDecl(
            fnName.value,
            paramNames.map(token => token.value),
            body,
            keyword.location
        );

        return this.makeSuccess(node);
    }

    macroDecl() {
        if (!this.check("KW_DECL", "macro")) return this.makeFailure();

        const keyword = this.expect("KW_DECL", "macro");
        const macroName = this.expect("IDENTIFIER");
        this.expect("LPAREN");

        const paramNames: Token[] = [];
        while (!this.check("RPAREN")) {
            paramNames.push(this.expect("IDENTIFIER"));
            if (this.check("COMMA")) this.eat();
        }

        const body = this.parseBlock();

        const node = new ASTCollection.MacroDecl(
            macroName.value,
            paramNames.map(token => token.value),
            body,
            keyword.location
        );

        return this.makeSuccess(node);
    }

    variableDecl() {
        if (!this.check("KW_DECL", "let")
            && !this.check("KW_DECL", "const")) {

            return this.makeFailure();
        }

        const keyword = this.expect("KW_DECL");
        const mutability = keyword.is("KW_DECL", "const");
        const varName = this.expect("IDENTIFIER");
        this.expect("EQUAL");
        const expression = new ExpressionParser(
            this.getUntil(token => token.is("SEMICOLON")),
            this.config
        ).parse();
        this.expect("SEMICOLON");

        const node = new ASTCollection.VariableDecl(
            varName.value,
            mutability,
            expression,
            keyword.location
        );

        return this.makeSuccess(node);
    }

    choose() {
        if (!this.check("KW_CONTROL", "choose")) return this.makeFailure();

        const keyword = this.expect("KW_CONTROL", "choose");
        const weights = [];
        const bodies = [];

        const getWeight = () => {
            if (this.check("LPAREN")) {
                this.eat();
                const weight = this.parseParenExpr();
                return weight;

            } else {
                return new ASTCollection.IntLiteral("1", keyword.location);
            }
        };

        weights.push(getWeight());
        bodies.push(this.parseBlock());

        while (this.check("KW_CONTROL", "or")) {
            this.eat();
            weights.push(getWeight());
            bodies.push(this.parseBlock());
        }

        const node = new ASTCollection.ChooseStatement(weights, bodies, keyword.location);
        return this.makeSuccess(node);
    }

    if() {
        if (!this.check("KW_CONTROL", "if")) return this.makeFailure();

        const keyword = this.expect("KW_CONTROL", "if");

        const getCondBody = () => {
            return {
                condition: this.parseParenExpr(),
                body: this.parseBlock()
            } as CondBodySet;
        }

        const ifSignature = getCondBody();
        const elifSignatures: CondBodySet[] = [];

        while (this.check("KW_CONTROL", "elif")) {
            this.eat();
            elifSignatures.push(getCondBody());
        }

        let elseSignature: CondBodySet | undefined = undefined;
        if (this.check("KW_CONTROL", "else")) {
            this.eat();
            elifSignatures.push(getCondBody());
        }

        const node = new ASTCollection.IfStatement(
            ifSignature, elifSignatures, elseSignature, keyword.location);

        return this.makeSuccess(node);
    }


    for() { }
    mcCommand() { }
    mcExec() { }
    repeat() { }
    while() { }

    execExpr() { }

    include() { }
}
