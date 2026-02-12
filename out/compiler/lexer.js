"use strict";
// test change for github
Object.defineProperty(exports, "__esModule", { value: true });
const regexTokens_cjs_1 = require("./tokens/regexTokens.cjs");
import { reservedKeywords } from "./tokens/reservedKeywords.cjs"
const token_cjs_1 = require("./tokens/token.cjs");
const metadata_cjs_1 = require("./metadata.cjs");
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
        for (const key of Object.keys(regexTokens_cjs_1.regexTokens)) {
            const regex = regexTokens_cjs_1.regexTokens[key];
            const optMatch = this.getCurrentSource().match(regex);
            let token;
            console.log("")
            if (optMatch === null) {
                throw new Error("failed lexing");
            }
            else {
                token = optMatch[0];
            }
            return new token_cjs_1.Token(key, token, new metadata_cjs_1.Location("test.oph", 1, 1, 1));
        }
        // after done
        return new token_cjs_1.Token("DONE", "done!", new metadata_cjs_1.Location("test.oph", 1, 1, 1));
    }
}
const src = "AAA eee ii OO u";
const lexlex = new Lexer(src);
console.log(lexlex.tokenize());
//# sourceMappingURL=lexer.js.map