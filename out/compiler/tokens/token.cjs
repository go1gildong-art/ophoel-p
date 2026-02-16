"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
// const Location = require("../metadata.cjs");
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
        return `${this.kind} "${this.value}" ${this.location.toString()}`;
    }
    static fromString(stringToken) {
        const TokenRegexes = {
            kind: /\w+/,
            value: /[\s\S]+/,
            fileName: /[\w\.]+/,
            line: /\d+/,
            column: /\d+/,
            tokenIndex: /\d+/,
        };
        const fullRegex = new RegExp(`^(${TokenRegexes.kind.source}) "(${TokenRegexes.value.source})"`
            + ` (${TokenRegexes.fileName.source}):(${TokenRegexes.line.source}):(${TokenRegexes.column.source})`
            + ` \\((${TokenRegexes.tokenIndex.source})\\)$`);
        console.log(fullRegex);
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
const originalStr = `STRING "then he said, "where is it?"" source.oph:1:1 (1)`;
const token = Token.fromString(originalStr);
const rebuiltStr = token.toString();
console.log(originalStr);
console.log(token);
console.log(rebuiltStr);
//# sourceMappingURL=token.cjs.map