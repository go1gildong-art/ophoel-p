import { Location } from "../metadata.cjs"

export class Token {
    kind: string;
    value: string;
    location: Location;

    constructor(kind: string, value: string, location: Location) {
        this.kind = kind;
        this.value = value;
        this.location = location;
    }

    // 1. enable by-value comparison between strings
    // 2. reform object to make it more concise and readable
    toString(): string {
        return `${this.kind} < ${this.value} > ${this.location.toString()}`;
    }

    is(kind: string, value?: string) {
        if (value != null) {
            return this.kind === kind && this.value === value;
        } else if (value == null) {
            return this.kind === kind;
        }
    }

    sameAs(token: Token) {
        const kind = this.kind === token.kind;
        const value = this.value === token.value;
        return kind && value;
    }

    static getTokensUntil(tokens: Token[], targetKind: string, targetValue?: string) {
        const collectedTokens: Token[] = [];

        for (const currentToken of tokens) {
            if (currentToken.is(targetKind, targetValue)) break;
            collectedTokens.push(currentToken);
        }
        
        return collectedTokens;
    }

    // from: [, {, (... 
    // to: ], }, )...
    // DOES NOT include "from" token (should be excluded in tokens argument)
    // DOES NOT include "to" token
    static getTokensBetween(tokens: Token[], fromToken: Token, toToken: Token) {
        let depth = 1; // initial depth for uncount starting from token
        const collectedTokens: Token[] = [];

        for (const currentToken of tokens) {
            if (currentToken.sameAs(fromToken)) depth++;
            else if (currentToken.sameAs(toToken)) depth--;

            if (depth <= 0) break;
            collectedTokens.push(currentToken);
        }

        return collectedTokens;
    }

    static fromString(stringToken: string): Token {
        const TokenRegexes = {
            kind: /\w+/,
            value: /[\s\S]+/,
            fileName: /[\w\-\.]+/,
            line: /\d+/,
            column: /\d+/,
            tokenIndex: /\d+/,
        }

        const fullRegex = new RegExp(
            `^(${TokenRegexes.kind.source}) < (${TokenRegexes.value.source}) >`
            + ` (${TokenRegexes.fileName.source}):(${TokenRegexes.line.source}):(${TokenRegexes.column.source})`
            + ` \\((${TokenRegexes.tokenIndex.source})\\)$`
        );

        const opt_matchArr = fullRegex.exec(stringToken);
        if (opt_matchArr == null) {
            throw new Error(`Token string does not follow the format! ${stringToken}`);
        } else if (opt_matchArr.length !== 7) {
            throw new Error(`Token string does not have enough information! ${stringToken}`);
        }

        const [, kind, value, fileName, ln, col, tokenIndex] = opt_matchArr;

        // using value! is justified, after performing the length check (opt_matchArr.length !== 7)
        return new Token(
            kind!,
            value!,
            new Location(
                fileName!,
                parseInt(ln!, 10),
                parseInt(col!, 10),
                parseInt(tokenIndex!, 10)
            )
        );
    }
}

