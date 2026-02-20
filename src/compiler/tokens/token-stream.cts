import { Location } from "../metadata.cjs"
import { Token } from "./token.cjs";

export class TokenStream {
    tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    length() {
        return this.tokens.length;
    }

    at(index: number) {
        return this.tokens.at(index);
    }

    slice(start?: number, end?: number) {
        return this.tokens.slice(start, end);
    }

    push(...tokens: Token[]) {
        this.tokens.push(...tokens);
    }

    entries() {
        return this.tokens.entries();
    }

    // stops at first targetKind/Value found
    getTokensUntil(targetKind: string, targetValue?: string) {
        const collectedTokens: Token[] = [];
        for (const currentToken of this.tokens) {
            if (currentToken.is(targetKind, targetValue)) break;
            collectedTokens.push(currentToken);
        }

        return new TokenStream(collectedTokens);
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
}

