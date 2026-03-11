import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser } from "./parser.cjs";
import { TokenStream } from "../tokens/token-stream.cjs";
import { ASTNode, Statement } from "../ast/ast.cjs";
import { OphoelParseError } from "./parse-error.cjs";
import { Token } from "../tokens/token.cjs";

import { ASTCollection } from "../ast/build-ast.cjs";
import { ExpressionParser } from "./expression-parser.cjs";
import { BinaryOperator } from "../ast/expressions/operations.cjs";
import { CondBodySet } from "../ast/statements/if.cjs";
import { ParseResult } from "./parser.cjs";
type ParserOption = {};

export class StatementParser extends Parser<ParserOption> {

    makeFailure(error: unknown): ParseResult<ParserOption> {
        return { 
            success: false, 
            error: error
        }; 
    }
    
    makeSuccess<result_T>(node: result_T): ParseResult<ParserOption, result_T> { 
        return { 
            success: true, 
            result: node,
            state: this.state.snapshot()
        }; 
    }

    unwrapProgram(program: Program) { return program.body; }

    parseBlock() {
        let newParser = this.branch();

        const startBrace = newParser.expect("LBRACE");

        const index = newParser.findIndexBetween(
            token => token.is("LBRACE"),
            token => token.is("RBRACE"));

        const bodyResult =
            new StatementParser({ })
                .parseMulti(index);
        
        newParser.expect("RBRACE");
            
        if (!bodyResult.success) return bodyResult;
        this.update(bodyResult);
        const block = new Block(bodyResult.result, startBrace.location);
        return this.makeSuccess(block)
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

    parseMulti(until: number = this.state.tokens.length()): ParseResult {
        const statements: Statement[] = [];
        while (this.pos < until) {
            const result = this.parse();

            if (!result.success) return result;
            this.update(result);
            statements.push(result.result);
        }

        return this.makeSuccess(statements);
    }

    parse(): ParseResult {
        const makeCheck = (kind: string, value: string, index: number = 0) => 
            ((parser: this) => parser.peek(index).is(kind, value));

        const branchMethod = (method: (() => ParseResult)) => {
            try { return method.call(this.branch()); }
            catch(err: unknown) { return this.makeFailure(err); }}


        const stmtParsers = [
            { condition: makeCheck("KW_DECL", "fn"), method: this.fnDecl },
            { condition: makeCheck("KW_DECL", "macro"), method: this.macroDecl },
            { condition: makeCheck("KW_DECL", "let"), method: this.variableDecl },
            { condition: makeCheck("KW_CONTROL", "choose"), method: this.choose },
            { condition: makeCheck("KW_CONTROL", "if"), method: this.if },
            { condition: makeCheck("KW_CONTROL", "for"), method: this.for },
            { condition: makeCheck("DOUBLEBANG", "!!", 1), method: this.mcCommand, },
            { condition: makeCheck("KW_CONTROL", "mc_exec"), method: this.mcExec },
            { condition: makeCheck("KW_CONTROL", "repeat"), method: this.repeat },
            { condition: makeCheck("KW_CONTROL", "while"), method: this.while },
            { condition: makeCheck("KW_PREPROCESS","include"), method: this.include }
        ];

        const result = stmtParsers
        .filter( entry => entry.condition(this) )
        .map( entry => branchMethod(entry.method) )[0]
        ?? this.branch().execExpr();        

        return result;
    }



    fnDecl(){
        if (!this.check("KW_DECL", "fn")) return this.makeFailure();

        const keyword = this.expect("KW_DECL", "fn");
        const fnName = this.expect("IDENTIFIER");
        const paramNames: Token[] = [];
        while (!this.check("RPAREN")) {
            const ident = this.expect("IDENTIFIER");
            state = ident.state;
            paramNames.push();
            if (this.check("COMMA")) this.eat();
        }

        const bodyResult = this.parseBlock();
        if (!bodyResult.success) return bodyResult;
        const body = bodyResult.result;

        const node = new ASTCollection.FunctionDecl(
            fnName.value,
            paramNames.map(token => token.value),
            body,
            keyword.location
        );

        const x = this.makeSuccess(node);
        if (x.success) x.result;
        return x;
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
                const bodyResult = this.parseBlock();
        if (!bodyResult.success) return bodyResult;
        const body = bodyResult.result;

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
            this.state.config
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


    for() {
        if (!this.check("KW_CONTROL", "for")) return this.makeFailure();

        const keyword = this.expect("KW_CONTROL", "for");

        this.expect("LPAREN");

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

    mcCommand() {
        if (!this.check("KW_CONTROL", "mc_")) return this.makeFailure();

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

    mcExec() {
        if (!this.check("KW_OPHOEL", "mc_exec")) return this.makeFailure();

        const keyword = this.expect("KW_OPHOEL", "mc_exec");
        const prefix = this.parseParenExpr();
                const bodyResult = this.parseBlock();
        if (!bodyResult.success) return bodyResult;
        const body = bodyResult.result;

        const node = new ASTCollection.McExecStatement(
            prefix, body, keyword.location);

        return this.makeSuccess(node);
    }

    repeat() {
        if (!this.check("KW_CONTROL", "while")) return this.makeFailure();

        const keyword = this.expect("KW_CONTROL", "while");
        const condition = this.parseParenExpr();
                const bodyResult = this.parseBlock();
        if (!bodyResult.success) return bodyResult;
        const body = bodyResult.result;

        const node = new ASTCollection.WhileStatement(
            condition, body, keyword.location);

        return this.makeSuccess(node);
    }

    while() {
        if (!this.check("KW_CONTROL", "while")) return this.makeFailure();

        const keyword = this.expect("KW_CONTROL", "while");
        const condition = this.parseParenExpr();
                const bodyResult = this.parseBlock();
        if (!bodyResult.success) return bodyResult;
        const body = bodyResult.result;

        const node = new ASTCollection.WhileStatement(
            condition, body, keyword.location);

        return this.makeSuccess(node);
    }

    include() {
        if (!this.check("KW_PREPROCESS", "include")) return this.makeFailure();

        const keyword = this.expect("KW_CONTROL", "while");
        const condition = this.parseParenExpr();
                const bodyResult = this.parseBlock();
        if (!bodyResult.success) return bodyResult;
        const body = bodyResult.result;

        const node = new ASTCollection.WhileStatement(
            condition, body, keyword.location);

        return this.makeSuccess(node);
    }


    execExpr() {
        if (!this.check("KW_PREPROCESS", "include")) return this.makeFailure();

        const keyword = this.expect("KW_CONTROL", "while");
        const condition = this.parseParenExpr();
                const bodyResult = this.parseBlock();
        if (!bodyResult.success) return bodyResult;
        const body = bodyResult.result;

        const node = new ASTCollection.WhileStatement(
            condition, body, keyword.location);

        return this.makeSuccess(node);
    }


}
