import { Location } from "../metadata.cjs"
import { Token } from "./token.cjs";

export class TokenStream {
    tokens: Token[];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    // stops at first targetKind/Value found
    getTokensUntil(targetKind: string, targetValue?: string) {
        const collectedTokens: Token[] = [];
        for (const currentToken of this.tokens) {
            if (currentToken.is(targetKind, targetValue)) break;
            collectedTokens.push(currentToken);
        }
        
        return collectedTokens;
    }

    // from: [, {, (... 
    // to: ], }, )...
    // DOES NOT include "from" token (should be excluded in tokens argument)
    // DOES NOT include "to" token
    getTokensBetween(fromToken: Token, toToken: Token) {
        let depth = 1; // initial depth for uncount starting from token
        const collectedTokens: Token[] = [];

        for (const currentToken of this.tokens) {
            if (currentToken.sameAs(fromToken)) depth++;
            else if (currentToken.sameAs(toToken)) depth--;

            if (depth <= 0) break;
            collectedTokens.push(currentToken);
        }

        return collectedTokens;
    }
}

