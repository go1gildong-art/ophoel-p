import { BuildAST, Location } from "./ast.js";
import { OphoelParseError } from "../errors.js";


class ExpressionParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.expressionPos = tokens[0].location.idx; // to track global position of the expression
        this.pos = 0;
    }

    getExprLocation() { return this.tokens[0].location; }

    // Helper to get current token
    peek() { return this.tokens[this.pos]; }

    // Helper to move forward
    eat() { return this.tokens[this.pos++]; }

    // Helper to check next token
    next() { return this.tokens[this.pos + 1]; }

    // Helper to catch syntax errors
    expect(type, value = null) {
        const token = this.eat();
        if (token == null || token.type !== type || (value && (token.value !== value))) {
            throw new OphoelParseError(`Error: Expected ${type} ${value || ''} but got ${token?.value}`, token);
        }
        return token;
    }

    // Helper to find out the tokens belong inside braces
    // mostly will work with braces
    getTokensBetween(type, value1, value2) {
        let depth = 1; // tracks how much braces are stacked. 0 when the code goes to its base block
        const startPos = this.pos;
        let endPos = this.pos;

        while (depth > 0) {
            endPos++;

            if (this.tokens[endPos].type === type && this.tokens[endPos].value === value1) {
                depth++;
            } else if (this.tokens[endPos].value === value2) {
                depth--;
            }


            if (endPos > this.tokens.length) throw new OphoelParseError(`The ${value1}${value2} structure is not closed`, this.tokens[startPos]);
        }


        // Capture the inside
        const block = this.tokens.slice(startPos, endPos);

        // Move the main parser's position AT the closing }
        this.pos = endPos;

        return block;
    }

    parse() {
        let left = this.parseComparison();
        return left;
    }

    parseComparison() {
        let left = this.parseMultiplicative();

        while (this.peek()?.type === 'OPERATOR' && ['>', '<', "=="].includes(this.peek().value)) {
            const operator = this.eat().value;
            const right = this.parse();

            // Wrap the current 'left' in a new tree
            left = BuildAST.BinaryExpression(operator, left, right, false, this.getExprLocation());
            this.eat();
        }

        return left;
    }

    parseAdditive() {
        let left = this.parseMultiplicative();

        while (this.peek()?.type === 'OPERATOR' && ['+', '-'].includes(this.peek().value)) {
            const operator = this.eat().value;
            const right = this.parse();

            // Wrap the current 'left' in a new tree
            left = BuildAST.BinaryExpression(operator, left, right, false, this.getExprLocation());
            this.eat();
        }

        return left;
    }

    parseMultiplicative() {
        let left = this.parsePrimary();

        while (this.peek()?.type === 'OPERATOR' && ['*', '/', "%"].includes(this.peek().value)) {
            const operator = this.eat().value;
            const right = this.parse();
            left = BuildAST.BinaryExpression(operator, left, right, false, this.getExprLocation());
        }

        return left;
    }

    parsePrimary() {
        const token = this.peek();

        if (token.type.match(/^(NUMBER|BOOL|STRING)$/)) {
            this.eat();
            return BuildAST.Literal(
                (token.type === "NUMBER" ? "int_c" :
                    token.type === "BOOL" ? "bool" :
                        "string"),

                String(token.value),

                this.getExprLocation());
        }

        if (token.type === "CONFIG_REF") {
            this.eat();
            return BuildAST.ConfigRef(token.value, this.getExprLocation());
        }

        if (token.type === 'SYMBOL' && token.value === "`") {
            this.eat(); // remove opening `
            const quasis = [];
            const exprs = [];

            do {
                const token = this.peek();
                if (token.type.match(/^(TEMPLATE_HEAD|TEMPLATE_BODY|TEMPLATE_TAIL)$/)) {
                    quasis.push(token.value);
                    this.eat();
                    continue;
                }

                if (token.type === "SYMBOL" && token.value === "$") {
                    this.eat();
                    this.expect("SYMBOL", "{");
                    const exprTokens = this.getTokensBetween("SYMBOL", "{", "}");
                    const expr = new ExpressionParser(exprTokens).parse();
                    exprs.push(expr);
                    this.eat();
                    continue;
                }

                if (token.type === "SYMBOL" && token.value === "`") {
                    break;
                }
            } while (true);

            return BuildAST.TemplateStringLiteral(quasis, exprs, this.getExprLocation())
        }

        if (token.type === 'IDENTIFIER') {
            return BuildAST.Identifier(this.eat().value, this.getExprLocation());
        }

        if (token.value === '(') {
            this.eat(); // eat (
            const exprTokens = this.getTokensBetween("SYMBOL", "(", ")");
            const expr = new ExpressionParser(exprTokens).parse();
            expr.hasParenthesis = true;
            this.eat(); // eat )
            return expr;
        }

        throw new OphoelParseError(`Unexpected token in expression: ${token.value}`, token);
    }
}

class OphoelParser {
    constructor(tokens, config = {}, symbols = {}) {
        this.tokens = tokens;
        this.pos = 0;
        this.ast = BuildAST.Program(BuildAST.Block([], tokens[0]?.location), tokens[0]?.location);
    }

    // Helper to get current token
    peek() { return this.tokens[this.pos]; }

    // Helper to move forward
    eat() { return this.tokens[this.pos++]; }

    // Helper to check next token
    next() { return this.tokens[this.pos + 1]; }

    // Helper to remove top level Program node
    unprogram(program) { return program.body.body; }

    // Helper to catch syntax errors
    expect(type, value = null) {
        const token = this.eat();
        if (token == null || token.type !== type || (value && (token.value !== value))) {
            throw new OphoelParseError(`Error: Expected ${type} ${value || ''} but got ${token?.type} ${token?.value}`, token);
        }
        return token;
    }

    // Helper to build commands
    // need double .body for accessing Program -> Block.body
    emit(ast) { this.ast.body.body.push(ast); }

    // Helper to find out the tokens belong inside braces
    // mostly will work with braces
    getTokensBetween(type, value1, value2) {
        let depth = 1; // tracks how much braces are stacked. 0 when the code goes to its base block
        const startPos = this.pos;
        let endPos = this.pos;

        while (depth > 0) {
            
            if (endPos >= this.tokens.length) {
                throw new OphoelParseError(`The ${value1}${value2} structure is not closed`, this.tokens[startPos]);
            }

            if (this.tokens[endPos].type === type && this.tokens[endPos].value === value1) {
                depth++;
            } else if (this.tokens[endPos].type === type && this.tokens[endPos].value === value2) {
                depth--;
            } else {
                endPos++;
            }

            
        }

        // Capture the inside
        const block = this.tokens.slice(startPos, endPos);

        // Move the main parser's position AT the closing }
        this.pos = endPos;

        return block;
    }

    // Helper to find out the expression, until specific token
    getTokensUntil(tokenType, tokenValue) {
        let startPos = this.pos;
        let endPos = (this.tokens
            .slice(startPos)
            .findIndex(token => token.type === tokenType && token.value === tokenValue)) + startPos;

        // Capture the inside
        const expr = this.tokens.slice(startPos, endPos);

        // Move the main parser's position AT the "until" token
        this.pos = endPos;
        return expr;
    }

    handleComment() {
        const c = this.eat();
        this.emit(BuildAST.Comment(c.value, c.location));
    }

    handlePreservedComment() {
        const pc = this.eat();
        this.emit(BuildAST.PreservedComment(pc.value, pc.location));
    }

    handlePreservedNewline() {
        const pn = this.eat();
        this.emit(BuildAST.PreservedNewline(pn.value.slice(0, 2), pn.location)); // change /.\n to /.
    }

    handleDeclaration() {
        const declTypeMap = {
            let: "variable",
            fn: "function",
            macro: "macro"
        }
        const decl = this.eat();
        const declType = declTypeMap[decl.value];


        if (declType === "variable") {

            let mutability;
            if (this.peek()?.type === "KW_SPECIFIER"
                && this.peek()?.value === "mut") {
                this.eat();
                mutability = true;
            } else {
                mutability = false;
            }

            const name = this.expect("IDENTIFIER");

            let type;
            if (this.peek().type === "SYMBOL" && this.peek().value == ":") {
                this.expect("SYMBOL", ":");
                type = this.expect("KW_TYPE");
            } else {
                type = { value: "deduct" };
            }




            // if declaration contains assignment
            if (this.peek()?.type === "OPERATOR" && this.peek()?.value === "=") {
                this.expect("OPERATOR", "=");
                const expr = this.getTokensUntil("SYMBOL", ";");
                this.expect("SYMBOL", ";");

                this.emit(BuildAST.VariableDecl(type.value, name.value, mutability, new ExpressionParser(expr).parse(), decl.location));
            } else {
                this.expect("SYMBOL", ";");
                this.emit(BuildAST.VariableDecl(type.value, name.value, mutability, null, decl.location));
            }
        }
    }

    handleAssignment() {
        const name = this.expect("IDENTIFIER");

        if (this.peek()?.type === "OPERATOR" && ["+", "-", "*", "/", "%"].includes(this.peek()?.value)) {
            // if operand is += style shorthand
            const oper = this.expect("OPERATOR");
            this.expect("OPERATOR", "=");
            const expr = this.getTokensUntil("SYMBOL", ";");
            this.expect("SYMBOL", ";");

            this.emit(BuildAST.VariableAssignShorten(name.value, new ExpressionParser(expr).parse(), oper.value, name.location));
        } else {
            // classic x = expr style operand
            this.expect("OPERATOR", "=");
            const expr = this.getTokensUntil("SYMBOL", ";");
            this.expect("SYMBOL", ";");

            this.emit(BuildAST.VariableAssign(name.value, new ExpressionParser(expr).parse(), name.location));
        }



        // save the variable inside storage
        // this.symbols[name.value] = value.value;
    }

    handleMcExec() {
        const keyword = this.expect("KW_BUILTIN", "mc_exec");
        // this.expect("BANG", "!");
        this.expect("SYMBOL", "(");
        const prefix = this.getTokensBetween("SYMBOL", "(", ")");
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", "{");
        const block = this.getTokensBetween("SYMBOL", "{", "}");
        this.expect("SYMBOL", "}");

        this.emit(
            BuildAST.McExecStatement([new ExpressionParser(prefix).parse()], [...this.unprogram(new OphoelParser(block).parse())], keyword.location)
        );
    }

    handleRepeat() {
        const keyword = this.expect("KW_CONTROL", "repeat");
        // this.expect("BANG", "!");
        this.expect("SYMBOL", "(");
        const count = this.getTokensBetween("SYMBOL", "(", ")");
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", "{");
        const block = this.getTokensBetween("SYMBOL", "{", "}");
        this.expect("SYMBOL", "}");

        this.emit(
            BuildAST.RepeatStatement([new ExpressionParser(count).parse()], [...this.unprogram(new OphoelParser(block).parse())], keyword.location)
        );
    }

    handleIf() {
        const keyword = this.expect("KW_CONTROL", "if");
        this.expect("SYMBOL", "(");
        const condition = this.getTokensBetween("SYMBOL", "(", ")");
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", "{");
        const block = this.getTokensBetween("SYMBOL", "{", "}");
        this.expect("SYMBOL", "}");

        this.emit(
            BuildAST.IfStatement([new ExpressionParser(condition).parse()], [...this.unprogram(new OphoelParser(block).parse())], keyword.location)
        );
    }

    handleChoose() {
        const weights = [];

        const keyword = this.expect("KW_CONTROL", "choose");

        if (this.peek()?.type === "SYMBOL" && this.peek()?.value === "(") {
            this.expect("SYMBOL", "(");
            const weight = (this.getTokensBetween("SYMBOL", "(", ")"));
            weights.push(weight);
            this.expect("SYMBOL", ")");
        } else {
            weights.push([ {
                type: "NUMBER",
                value: "1",
                location: keyword.location
            } ]);
        }

        this.expect("SYMBOL", "{");
        const bodies = [];
        bodies.push(this.getTokensBetween("SYMBOL", "{", "}"));
        this.expect("SYMBOL", "}");

        while (this.peek()?.type === "KW_CONTROL" && this.peek()?.value === "or") {
            this.expect("KW_CONTROL", "or");

            if (this.peek()?.type === "SYMBOL" && this.peek()?.value === "(") {
                this.expect("SYMBOL", "(");
                const weight = (this.getTokensBetween("SYMBOL", "(", ")"));
                weights.push(weight);
                this.expect("SYMBOL", ")");
            } else {
                weights.push([ {
                    type: "NUMBER",
                    value: "1",
                    location: keyword.location
                }] );
            }

            this.expect("SYMBOL", "{");
            bodies.push(this.getTokensBetween("SYMBOL", "{", "}"));
            this.expect("SYMBOL", "}");
        }

        this.emit(BuildAST.ChooseStatement(
            bodies.map(body => this.unprogram(new OphoelParser(body).parse())),
            weights.map(weight => new ExpressionParser(weight).parse()),
            keyword.location
        ));
    }

    handleRawCommand() {
        const command = this.expect("KW_MCCOMMAND");
        this.expect("DOUBLE_BANG", "!!");
        this.expect("SYMBOL", "(");
        const commandArgs = this.getTokensBetween("SYMBOL", "(", ")")
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", ";");

        this.emit(
            BuildAST.McCommand(command.value, [new ExpressionParser(commandArgs).parse()], command.location)
        );
    }

    parse() {
        // first, check all invalid tokens
        this.tokens
            .filter(token => token.type === "INVALID")
            .forEach(token => {
                throw new OphoelParseError(`Source code has invalid token ${token.value}!`, token);
            });


        while (this.pos < this.tokens.length) {
            const token = this.peek();

            // 1. Skip Comments
            if (token.type === 'COMMENT') {
                this.handleComment();
                continue;
            }

            // 2. emit preserved comments
            if (token.type === 'PRESERVED_COMMENT') {
                this.handlePreservedComment();
                continue;
            }

            // 2. emit preserved comments
            if (token.type === 'PRESERVED_NEWLINE') {
                this.handlePreservedNewline();
                continue;
            }

            // 3. Handle Declarations (let x: string)
            if (token.type === 'KW_DECL') {
                this.handleDeclaration();
                continue;
            }

            // 4. Handle variable assignments (x = "y")
            if (token.type === 'IDENTIFIER') {
                this.handleAssignment();
                continue;
            }

            // 4. Handle mc_exec
            if (token.type === "KW_BUILTIN" && token.value === 'mc_exec') {
                this.handleMcExec();
                continue;
            }

            // 5. Handle repeat
            if (token.type === "KW_CONTROL" && token.value === 'repeat') {
                this.handleRepeat();
                continue;
            }

            // 5. Handle if
            if (token.type === "KW_CONTROL" && token.value === 'if') {
                this.handleIf();
                continue;
            }

            // 5. Handle choose
            if (token.type === "KW_CONTROL" && token.value === 'choose') {
                this.handleChoose();
                continue;
            }

            // 6. Handle Raw Commands (give!!, summon!!, etc)
            if (token.type === 'KW_MCCOMMAND' && this.tokens[this.pos + 1]?.type === 'DOUBLE_BANG') {
                this.handleRawCommand();
                continue;
            }


            // fallback behavior
            console.log(JSON.stringify(this.ast));
            throw new OphoelParseError(`Error: Unexpected token ${token.value}`, token);
        }
        return this.ast;
    }
}


export function parse(tokens, config = {}, symbols = {}) {
    return new OphoelParser(tokens, config, symbols).parse();
}
