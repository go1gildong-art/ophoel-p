import { Location } from "../metadata.cjs"
import { Token } from "./token.cjs";

export class TokenStream {

    constructor(public tokens: Token[]) {}

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
        return new TokenStream(this.tokens.map<U>(callback, thisArg));
    }

    reduce<U>(callback: (accumulator: U, value: Token, index: number, array: Token[]) => U, thisArg?: any) {
        return new TokenStream(this.tokens.reduce(callback, thisArg));
    }

    // stops at first targetKind/Value found
    getTokensUntil(targetKind: string, targetValue?: string) {
        return this.slice(0, this.findIndex(token => token.is(targetKind, targetValue)))
    }

    // from: [, {, (... 
    // to: ], }, )...
    // DOES NOT include "from" token (should be excluded in tokens argument)
    // DOES NOT include "to" token
    getTokensBetween(fromKind: string, toKind: string, fromValue?: string, toValue?: string) {
        let depth = 1; // initial depth for uncount starting from token
        const collectedTokens: Token[] = [];

        for (const currentToken of this.tokens) {
            if (currentToken.is(fromKind, fromValue)) depth++;
            else if (currentToken.is(toKind, toValue)) depth--;

            if (depth <= 0) break;
            collectedTokens.push(currentToken);
        }

        return new TokenStream(collectedTokens);
    }

    chunk<chunk_T>() {

        const accumulator = [];

        for (let i = 0; i < names.length; i++) {

        }

        const len = names.length;
    const chunks = Object.fromEntries(

        this.tokens.map((_, idx, stream) => 
            (idx % len === 0)
            ? stream.slice(idx, idx + len)
            : undefined
        )
        .filter(stream => stream != undefined)
        .map(stream => stream.map((token, idx) => [names[idx], token]))
    )

        Object.fromEntries()

        const x = Array.from({ length: len }, (_, index) => {
            const i = index
        })
    }
}

