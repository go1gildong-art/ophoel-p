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
    toString() { return `${this.kind} < ${this.value} > ${this.location.toString()}`; }
    is(kind, value) {
        const isKind = this.kind === kind;
        const isValue = [this.value, undefined].includes(value);
        return isKind && isValue;
    }
    isInside(...kinds) {
        return kinds.includes(this.kind);
    }
    sameAs(token) {
        const kind = this.kind === token.kind;
        const value = this.value === token.value;
        return kind && value;
    }
    flatten() {
        return {
            "kind": this.kind,
            "value": this.value,
            "fileName": this.location.fileName,
            "line": this.location.line,
            "column": this.location.column,
            "tokenIndex": this.location.tokenIndex
        };
    }
    static fromString(stringToken) {
        const rgx = {
            kind: /\w+/.source,
            value: /[\s\S]*/.source,
            fileName: /[\w\-\.]+/.source,
            line: /\d+/.source,
            column: /\d+/.source,
            tokenIndex: /\d+/.source,
        };
        const fullRegex = new RegExp(`^(${rgx.kind}) < (${rgx.value}) >` +
            ` (${rgx.fileName}):(${rgx.line}):(${rgx.column})` +
            ` \\((${rgx.tokenIndex})\\)$`);
        const opt_matchArr = fullRegex.exec(stringToken);
        if (opt_matchArr == null) {
            throw new Error(`Token string does not follow the format! ${stringToken}`);
        }
        else if (opt_matchArr.length !== 7) {
            throw new Error(`Token string does not have enough information! ${stringToken}`);
        }
        const [, kind, value, fileName, ln, col, tokenIndex] = opt_matchArr;
        // using value!, after performing the length check (opt_matchArr.length !== 7)
        return new Token(kind, value, new metadata_cjs_1.Location(fileName, parseInt(ln, 10), parseInt(col, 10), parseInt(tokenIndex, 10)));
    }
}
exports.Token = Token;
//# sourceMappingURL=token.cjs.map