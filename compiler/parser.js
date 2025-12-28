import { AST } from "./ast.js";

class OphoelParseError extends Error { };

const typeMapper = {
    "NUMBER": "int_c",
    "STRING": "string",
    "BOOL": "bool"
}

class OphoelParser {
    constructor(tokens, config, symbols = {}) {
        this.tokens = tokens;
        this.config = config;
        this.pos = 0;
        this.symbols = symbols; // Variable storage
        this.effectStack = []; // For managing /execute prefixes 
        this.commands = []; // Final .mcfunction lines
    }

    // Helper to get current token
    peek() { return this.tokens[this.pos]; }

    // Helper to move forward
    eat() { return this.tokens[this.pos++]; }

    // Helper to catch syntax errors
    expect(type, value = null) {
        const token = this.eat();
        if (token == null || token.type !== type || (value && (token.value !== value))) {
            throw new OphoelParseError(`Error: Expected ${type} ${value || ''} but got ${token?.type} at idx ${(this.peek() != undefined) ? this.peek().idx : (this.tokens[this.pos - 2].idx + 1)}`);
        }
        return token;
    }

    // Helper to check if a symbol exists
    validateSymbol(sym) {
        if (!Object.keys(this.symbols).includes(sym)) {
            throw new OphoelParseError(`Error: Using undefined variable ${sym} at idx ${this.peek().idx}`);
        }
        return sym;
    }

    // Helper to evaluate template strings. currently only accept variables
    evaluateString(str) {
        // regex to find ${} pattern
        const finder = /\${[A-Za-z0-9._!\(\)\[\]]+}/;
        const finderGlobal = /\${[A-Za-z0-9._!\(\)\[\]]+}/g;

        const print = (x) => {
            console.log(x);
            return x;
        };

        const evaluatedStr = (str
            .match(finderGlobal) || []) // extracts ${} inside string 
            .map(part => part.slice(2, -1)) // extracts only symbols without puncs
            .map(sym => this.validateSymbol(sym)) // check symbols if they exist
            .map(sym => this.symbols[sym]) // convert to values
            // .map(value => this.evaluateStrExpr(value)) // evalutate if it's expression
            // .map(value => value.trim().slice(1, -1)) // remove "" at the both ends of the evalated part of the string 
            .reduce((acc, value) => acc.replace(finder, value), str) // replaces ${} into values. returns string
            .trim();
        // .slice(1, -1); // remove "" at the both ends of the string 

        return evaluatedStr
    }

    // Helper to evaluate expressions. dummy data
    evaluateExpression(expr) {

        // return if single value
        if (expr.length === 1) return expr[0];
        if (!Array.isArray(expr)) return expr;


        // 1. Map variables/numbers to a string
        const expressionString = expr.map(t => {
            if (t.type === 'VARIABLE' || t.type === 'IDENTIFIER') {
                const val = this.symbols[t.value];
                if (val === undefined) throw new OphoelParseError(`Undefined variable: ${t.value} at idx ${this.peek().idx}`);
                
                return val;
            }
            return t.value; // Returns the number or operator (+, -, *, /)
        }).join(' ');

        // 2. Security Check (ensure no malicious code injection)
        if (/[^0-9\+\-\*\/\(\)\.\s]/.test(expressionString)) {
            throw new OphoelParseError(`Illegal math: ${expressionString} at idx ${this.peek().idx}`);
        }

        // 3. Calculation
        return new Function(`return {type: "NUMBER", value: Math.round(${expressionString})}`)();
    }

    // Helper to build commands
    emit(cmd) {
        this.commands.push(cmd);
    }

    // Helper to find out the tokens belong inside braces
    getBraceBlock() {
        let depth = 1; // tracks how much braces are stacked. 0 when the code goes to its base block
        let startPos = this.pos;
        let endPos = this.pos;
        while (depth > 0) {
            endPos++;
            if (this.tokens[endPos].type === "SYMBOL" && this.tokens[endPos].value === "{") {
                depth++;
            } else if (this.tokens[endPos].value === "}") {
                depth--;
            }
        }

        if (depth > 0) {
            throw new OphoelParseError("Error: Unclosed brace block detected");
        }

        // Capture the inside
        const block = this.tokens.slice(startPos, endPos);

        // Move the main parser's position AT the closing }
        this.pos = endPos;

        return block;
    }

    // Helper to find out the expression, until semicolon
    getExpressionUntilSemicolon() {
        let startPos = this.pos;
        let endPos = (this.tokens
            .slice(startPos)
            .findIndex(token => token.type === "SYMBOL" && token.value === ";")) + startPos;

        // Capture the inside
        const expr = this.tokens.slice(startPos, endPos);


        // Move the main parser's position AT the ;
        this.pos = endPos;
        return expr;
    }

    handleAssignment() {
        const type = this.expect("KW_TYPE");
        const name = this.expect("IDENTIFIER");
        if (this.symbols[name] != null) {
            throw new OphoelParseError(`Error: Variable ${name} already exists at idx ${this.peek().idx}`);
        }
        this.expect("OPERATOR", "=");
        const expr = this.getExpressionUntilSemicolon();
        const value = this.evaluateExpression(expr);
        if (typeMapper[value.type] !== type.value) {
            throw new OphoelParseError(`Error: Mismatching type assignment. Tried ${typeMapper[value.type]} to ${type.value} at idx ${this.peek().idx}`);
        }
        this.expect("SYMBOL", ";");

        // save the variable inside storage
        this.symbols[name.value] = value.value;
    }

    handleMcExec() {
        this.expect("KW_MACRO", "mc_exec");
        this.expect("BANG", "!");
        this.expect("SYMBOL", "(");
        const prefix = this.expect("STRING").value;
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", "{");
        const subTokens = this.getBraceBlock();
        const results = new OphoelParser(subTokens, this.config, this.symbols).parse();
        results
            .map(cmd => `execute ${this.evaluateString(prefix)} run ${cmd}`)
            .forEach(cmd => this.emit(cmd));
        this.expect("SYMBOL", "}");
    }

    handleRepeat() {
        this.expect("KW_MACRO", "repeat");
        this.expect("BANG", "!");
        this.expect("SYMBOL", "(");
        const count = this.expect("NUMBER").value;
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", "{");
        const pos = this.pos;
        const subTokens = this.getBraceBlock();
        const results = new OphoelParser(subTokens, this.config, this.symbols, pos).parse();
        for (let i = 0; i < count; i++) {
            results.forEach(cmd => this.emit(cmd));
        }
        this.expect("SYMBOL", "}");
    }

    handleRawCommand() {
        const command = this.expect("KW_MCCOMMAND").value;
        this.expect("DOUBLE_BANG", "!!");
        this.expect("SYMBOL", "(");
        const commandArgs = this.expect("STRING").value;
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", ";");
        this.commands.push(`${command} ${this.evaluateString(commandArgs)}`);
    }

    parse() {
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

            // 3. Handle mc_exec!
            if (token.value === 'mc_exec' && this.tokens[this.pos + 1]?.value === '!') {
                this.handleMcExec();
                continue;
            }

            // 4. Handle repeat!
            if (token.value === 'repeat' && this.tokens[this.pos + 1]?.value === '!') {
                this.handleRepeat();
                continue;
            }

            // 5. Handle Raw Commands (give!!, summon!!, etc)
            if (token.type === 'KW_MCCOMMAND' && this.tokens[this.pos + 1]?.type === 'DOUBLE_BANG') {
                this.handleRawCommand();
                continue;
            }

            throw new OphoelParseError(`Error: Unexpected token ${token.value} at idx ${token.idx}`); // Default fallback
        }
        return this.commands;
    }
}


export function parse(tokens, config, symbols = {}) {
    return new OphoelParser(tokens, config, symbols).parse();
}
