"use strict";
const regexTokens = require("./tokens/regexTokens.cjs");
const reservedKeywords = require("./tokens/reservedKeywords.cjs");
const { Token } = require("./tokens/token.cjs");
const Location = require("./metadata.cjs");
class Lexer {
    constructor(source) {
        this.pos = 0;
        this.tokens = [];
        this.source = source;
    }
    getCurrentSource() {
        return this.source.slice(this.pos);
    }
    tokenize() {
        this.tokens.push(this.getToken());
        return this.tokens;
    }
    getToken() {
        for (const key of Object.keys(regexTokens)) {
            const regex = regexTokens[key];
            const optMatch = this.getCurrentSource().match(regex);
            let token;
            if (optMatch === null) {
                throw new Error("failed lexing");
            }
            else {
                token = optMatch[0];
            }
            return new Token(key, token, new Location("test.oph", 1, 1, 1));
        }
        // after done
        return new Token("DONE", "done!", new Location("test.oph", 1, 1, 1));
    }
}
const src = "AAA eee ii OO u";
const lexlex = new Lexer(src);
console.log(lexlex.tokenize());
//# sourceMappingURL=lexer.js.map