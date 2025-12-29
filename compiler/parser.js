import { AST, Location } from "./ast.js";

class OphoelParseError extends Error {
    constructor(msg, token) {
        return new Error(msg + ` at ${token?.location.fileName}:${token?.location.line}, ${token?.location.tokenIdx}`);
    }
};

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
        return this.parseAdditive();
    }

    parseAdditive() {
        let left = this.parseMultiplicative();

        while (this.peek()?.type === 'OPERATOR' && ['+', '-'].includes(this.peek().value)) {
            const operator = this.eat().value;
            const right = this.parseAdditive();

            // Wrap the current 'left' in a new tree
            left = AST.BinaryExpression(operator, left, right);
        }

        return left;
    }

    parseMultiplicative() {
        let left = this.parsePrimary();

        while (this.peek()?.type === 'OPERATOR' && ['*', '/'].includes(this.peek().value)) {
            const operator = this.eat().value;
            const right = this.parseMultiplicative();
            left = AST.BinaryExpression(operator, left, right);
        }

        return left;
    }

    parsePrimary() {
        const token = this.peek();

        if (token.type.match(/^(NUMBER|STRING|BOOL)$/)) {
            return AST.Literal(token.value, String(token.value), this.getExprLocation());
        }

        if (token.type === 'SYMBOL' && token.value === "`") {
            this.eat(); // remove 1st `
            const quasis = [];
            const exprs = [];

            do {
                const token = this.peek();
                console.log(token)

                if (token.type.match(/^(TEMPLATE_HEAD|TEMPLATE_BODY|TEMPLATE_TAIL)$/)) {
                    quasis.push(token.value);
                    this.eat();
                    continue;
                }

                if (token.type === "SYMBOL" && token.value === "$") {
                    this.eat();
                    this.expect("SYMBOL", "{");
                    const exprTokens = this.getTokensBetween("SYMBOL", "{", "}");
                    exprs.push(new ExpressionParser(exprTokens, this.pos + this.expressionPos).parse());
                    this.eat();
                    continue;
                }

                if (token.type === "SYMBOL" && token.value === "`") {
                    break;
                }

            } while (true);


            return AST.TemplateStringLiteral(quasis, exprs, this.getExprLocation())
        }

        if (token.type === 'IDENTIFIER') {
            return AST.Identifier(this.eat().value, this.getExprLocation());
        }

        if (token.value === '(') {
            this.eat(); // eat (
            const expr = this.parse();
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
        this.ast = [];
    }

    // Helper to get current token
    peek() { return this.tokens[this.pos]; }

    // Helper to move forward
    eat() { return this.tokens[this.pos++]; }

    // Helper to catch syntax errors
    expect(type, value = null) {
        const token = this.eat();
        if (token == null || token.type !== type || (value && (token.value !== value))) {
            throw new OphoelParseError(`Error: Expected ${type} ${value || ''} but got ${token?.type}`, token);
        }
        return token;
    }

    // Helper to build commands
    emit(ast) { this.ast.push(ast); }

    // Helper to find out the tokens belong inside braces
    // mostly will work with braces
    getTokensBetween(type, value1, value2) {
        let depth = 1; // tracks how much braces are stacked. 0 when the code goes to its base block
        const startPos = this.pos;
        let endPos = this.pos;

        while (depth > 0) {
            endPos++;
            if (endPos >= this.tokens.length) throw new OphoelParseError(`The ${value1}${value2} structure is not closed`, this.tokens[startPos]);

            if (this.tokens[endPos].type === type && this.tokens[endPos].value === value1) {
                depth++;
            } else if (this.tokens[endPos].value === value2) {
                depth--;
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

    handleAssignment() {
        const type = this.expect("KW_TYPE");
        const name = this.expect("IDENTIFIER");
        this.expect("OPERATOR", "=");
        const expr = this.getTokensUntil("SYMBOL", ";");
        this.expect("SYMBOL", ";");

        this.emit(AST.VariableDecl(type.value, name.value, new ExpressionParser(expr).parse(), type.location))

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
            AST.McExecStatement(new ExpressionParser(prefix).parse(), new OphoelParser(block).parse(), keyword.location)
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
            AST.RepeatStatement(new ExpressionParser(count).parse(), new OphoelParser(block).parse(), keyword.location)
        );
    }

    handleRawCommand() {
        const command = this.expect("KW_MCCOMMAND");
        this.expect("DOUBLE_BANG", "!!");
        this.expect("SYMBOL", "(");
        const commandArgs = this.getTokensBetween("SYMBOL", "(", ")")
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", ";");

        this.emit(
            AST.McCommand(command.value, new ExpressionParser(commandArgs).parse(), command.location)
        );
    }

    parse() {

        // first, check all invalid tokens
        let invalidFlag = false;
        this.tokens
            .filter(token => token.type === "INVALID")
            .forEach(token => {
                console.error(`Invalid token ${token.value} at ${token.location.filename}:${token.location.line}, ${token.location.idx}`);
                invalidFlag = true;
            });
            if (invalidFlag) throw new Error("Source code has invalid tokens!")

        while (this.pos < this.tokens.length) {
            const token = this.peek();

            // 1. Skip Comments
            if (token.type === 'COMMENT') {
                this.eat();
                continue;
            }

            // 2. Handle Assignments (string x = "y")
            if (token.type === 'KW_TYPE') {
                this.handleAssignment();
                continue;
            }

            // 3. Handle mc_exec
            if (token.type === "KW_BUILTIN" && token.value === 'mc_exec') {
                this.handleMcExec();
                continue;
            }

            // 4. Handle repeat
            if (token.type === "KW_CONTROL" && token.value === 'repeat') {
                this.handleRepeat();
                continue;
            }

            // 5. Handle Raw Commands (give!!, summon!!, etc)
            if (token.type === 'KW_MCCOMMAND' && this.tokens[this.pos + 1]?.type === 'DOUBLE_BANG') {
                this.handleRawCommand();
                continue;
            }

            console.log(JSON.stringify(this.ast));
            throw new OphoelParseError(`Error: Unexpected token ${token.value}`, token); // Default fallback
        }
        return this.ast;
    }
}


export function parse(tokens, config = {}, symbols = {}) {
    return new OphoelParser(tokens, config, symbols).parse();
}
