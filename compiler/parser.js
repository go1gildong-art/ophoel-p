class OphoelParseError extends Error { };

const typeMapper = {
    "NUMBER": "int_c",
    "STRING": "string",
    "BOOL": "bool"
}

const reservedKeywords = {
    "KW_MACRO": [
        "repeat",
        "mc_exec"
    ],
    "KW_CONTROL": [
        "if",
        "else"
    ],
    "KW_TYPE": [
        "int_c",
        "string",
        "bool"
    ],
    "LIT_VAL": [
        "null",
    ],
    "KW_MCCOMMAND": [
        "give",
        "execute",
        "scoreboard",
        "tellraw",
        "say",
        "summon",
        "effect"
    ]
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
        if (!token || token.type !== type || (value && (token.value !== value))) {
            throw new OphoelParseErrorError(`Error: Expected ${type} ${value || ''} but got ${token?.type} at idx ${this.peek().idx}`);
        }
        return token;
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
            throw new OphoelParseError("Error: Unclosed brace block detected.");
        }

        // Capture the inside
        const block = this.tokens.slice(startPos, endPos);

        // Move the main parser's position AT the closing }
        this.pos = endPos;

        return block;
    }

    handleAssignment() {
        const type = this.expect("KW_TYPE");
        const name = this.expect("IDENTIFIER");
        if (this.symbols[name] != null) {
            throw new OphoelParseError(`Error: Variable ${name} already exists at idx ${this.peek().idx}`);
        }
        this.expect("OPERATOR", "=");
        const value = this.eat();
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
        this.commands = this.commands.concat(
            results
                .map(cmd => `execute ${prefix} run ${cmd}`)
        );
        this.expect("SYMBOL", "}");
    }

    handleRepeat() {
        this.expect("KW_MACRO", "repeat");
        this.expect("BANG", "!");
        this.expect("SYMBOL", "(");
        const count = this.expect("NUMBER").value;
        this.expect("SYMBOL", ")");
        this.expect("SYMBOL", "{");
        const subTokens = this.getBraceBlock();
        const results = new OphoelParser(subTokens, this.config, this.symbols).parse();
        for (let i = 0; i < count; i++) {
            this.commands = this.commands.concat(results);
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
        this.commands.push(`${command} ${commandArgs}`);
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