"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const metadata_cjs_1 = require("../metadata.cjs");
class Token {
    constructor(kind, value, location) {
        this.kind = kind;
        this.value = value;
        this.location = location;
    }
    // 1. enable by-value comparison between strings
    // 2. reform object to make it more concise and readable
    toString() {
        return `${this.kind} < ${this.value} > ${this.location.toString()}`;
    }
    is(kind, value) {
        if (value != null) {
            return this.kind === kind && this.value === value;
        }
        else if (value == null) {
            return this.kind === kind;
        }
    }
    sameAs(token) {
        const kind = this.kind === token.kind;
        const value = this.value === token.value;
        return kind && value;
    }
    static getTokensUntil(tokens, targetKind, targetValue) {
        const collectedTokens = [];
        for (const currentToken of tokens) {
            if (currentToken.is(targetKind, targetValue))
                break;
            collectedTokens.push(currentToken);
        }
        return collectedTokens;
    }
    // from: [, {, (... 
    // to: ], }, )...
    // DOES NOT include "from" token (should be excluded in tokens argument)
    // DOES NOT include "to" token
    static getTokensBetween(tokens, fromToken, toToken) {
        let depth = 1; // initial depth for uncount starting from token
        const collectedTokens = [];
        for (const currentToken of tokens) {
            if (currentToken.sameAs(fromToken))
                depth++;
            else if (currentToken.sameAs(toToken))
                depth--;
            if (depth <= 0)
                break;
            collectedTokens.push(currentToken);
        }
        return collectedTokens;
    }
    static fromString(stringToken) {
        const TokenRegexes = {
            kind: /\w+/,
            value: /[\s\S]+/,
            fileName: /[\w\-\.]+/,
            line: /\d+/,
            column: /\d+/,
            tokenIndex: /\d+/,
        };
        const fullRegex = new RegExp(`^(${TokenRegexes.kind.source}) < (${TokenRegexes.value.source}) >`
            + ` (${TokenRegexes.fileName.source}):(${TokenRegexes.line.source}):(${TokenRegexes.column.source})`
            + ` \\((${TokenRegexes.tokenIndex.source})\\)$`);
        const opt_matchArr = fullRegex.exec(stringToken);
        if (opt_matchArr == null) {
            throw new Error(`Token string does not follow the format! ${stringToken}`);
        }
        else if (opt_matchArr.length !== 7) {
            throw new Error(`Token string does not have enough information! ${stringToken}`);
        }
        const [, kind, value, fileName, ln, col, tokenIndex] = opt_matchArr;
        // using value! is justified, after performing the length check (opt_matchArr.length !== 7)
        return new Token(kind, value, new metadata_cjs_1.Location(fileName, parseInt(ln, 10), parseInt(col, 10), parseInt(tokenIndex, 10)));
    }
}
exports.Token = Token;
//# sourceMappingURL=token.cjs.map