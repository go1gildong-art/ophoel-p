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

    flatten() {
        return {
            "kind": this.kind,
            "value": this.value,
            "fileName": this.location.fileName,
            "line": this.location.line,
            "column": this.location.column,
            "tokenIndex": this.location.tokenIndex
        }
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

