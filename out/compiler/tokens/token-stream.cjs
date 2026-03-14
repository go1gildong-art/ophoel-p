"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStream = void 0;
class TokenStream {
    constructor(tokens) {
        this.tokens = tokens;
    }
    length() { return this.tokens.length; }
    at(index) { return this.tokens.at(index); }
    slice(start, end) { return new TokenStream(this.tokens.slice(start, end)); }
    findIndex(predicate, thisArg) {
        return this.tokens.findIndex(predicate, thisArg);
    }
    push(...tokens) { this.tokens.push(...tokens); }
    entries() { return this.tokens.entries(); }
    forEach(callback, thisArg) {
        this.tokens.forEach(callback, thisArg);
    }
    filter(callback, thisArg) {
        return new TokenStream(this.tokens.filter(callback, thisArg));
    }
    map(callback, thisArg) {
        return this.tokens.map(callback, thisArg);
    }
    reduce(callback, thisArg) {
        return this.tokens.reduce(callback, thisArg);
    }
    getUntil(predicate, thisArg) {
        const targetIndex = this.findIndex(predicate, thisArg);
        return targetIndex !== -1
            ? this.slice(0, targetIndex)
            : this;
    }
    findIndexBetween(fromPredicate, toPredicate, thisArg) {
        let depth = 1; // initial depth for uncount starting from token
        const collectedTokens = [];
        let index = 0;
        const array = this.tokens;
        for (const currentToken of this.tokens) {
            if (fromPredicate(currentToken, index, array))
                depth++;
            else if (toPredicate(currentToken, index, array))
                depth--;
            if (depth <= 0)
                break;
            index++;
        }
        return index;
    }
    getBetween(fromPredicate, toPredicate, thisArg) {
        const index = this.findIndexBetween(fromPredicate, toPredicate, thisArg);
        return this.slice(0, index);
    }
    chunk(len) {
        const chunks = this.map((_, idx, stream) => (idx % len === 0)
            ? stream.slice(idx, idx + len)
            : undefined)
            .filter(stream => stream != undefined);
        return chunks;
    }
}
exports.TokenStream = TokenStream;
//# sourceMappingURL=token-stream.cjs.map