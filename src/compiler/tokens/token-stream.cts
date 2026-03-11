import { Location } from "../metadata.cjs"
import { Token } from "./token.cjs";

export type TokenPredicate = (token: Token, index?: number, array?: Token[]) => boolean;
export class TokenStream {

    constructor(public tokens: Token[]) { }

    length() { return this.tokens.length; }

    at(index: number) { return this.tokens.at(index) as Token | undefined; }

    slice(start?: number, end?: number) { return new TokenStream(this.tokens.slice(start, end)); }

    findIndex(predicate: (v: Token, idx: number, obj: Token[]) => boolean, thisArg?: any) {
        return this.tokens.findIndex(predicate, thisArg);
    }

    push(...tokens: Token[]) { this.tokens.push(...tokens); }

    entries() { return this.tokens.entries(); }

    forEach(callback: (value: Token, index: number, array: Token[]) => any, thisArg?: any) {
        this.tokens.forEach(callback, thisArg);
    }

    filter(callback: (value: Token, index: number, array: Token[]) => any, thisArg?: any) {
        return new TokenStream(this.tokens.filter(callback, thisArg));
    }

    map<U>(callback: (value: Token, index: number, array: Token[]) => U, thisArg?: any) {
        return this.tokens.map<U>(callback, thisArg);
    }

    reduce<U>(callback: (accumulator: U, value: Token, index: number, array: Token[]) => U, thisArg?: any) {
        return this.tokens.reduce<U>(callback, thisArg);
    }

    getUntil(predicate: TokenPredicate, thisArg?: any) {
        const targetIndex = this.findIndex(predicate, thisArg);
        return targetIndex !== -1
        ? this.slice(0, targetIndex)
        : this
    }

    findIndexBetween(fromPredicate: TokenPredicate, toPredicate: TokenPredicate, thisArg?: any) {
        let depth = 1; // initial depth for uncount starting from token
        const collectedTokens: Token[] = [];
        
        let index = 0;
        const array = this.tokens;
        for (const currentToken of this.tokens) {
            
            if (fromPredicate(currentToken, index, array)) depth++;
            else if (toPredicate(currentToken, index, array)) depth--;
            if (depth <= 0) break;

            index++;
        }

        return index;
    }

    getBetween(fromPredicate: TokenPredicate, toPredicate: TokenPredicate, thisArg?: any) {
        const index = this.findIndexBetween(fromPredicate, toPredicate, thisArg);
        return this.slice(0, index);
    }

    chunk(len: number) {
        const chunks =
            this.map((_, idx, stream) =>
                (idx % len === 0)
                    ? stream.slice(idx, idx + len)
                    : undefined
            )
            .filter(stream => stream != undefined)

            return chunks;
    }
}

