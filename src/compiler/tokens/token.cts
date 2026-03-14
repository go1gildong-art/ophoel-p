import { Location } from "../metadata.cjs"


export class Token {

    constructor(
        public kind: string,
        public value: string,
        public location: Location) { }

    // 1. enable by-value comparison between strings
    // 2. reform object to make it more concise and readable
    toString(): string { return `${this.kind} < ${this.value} > ${this.location.toString()}`; }

    is(kind: string, value?: string) {
        const isKind = this.kind === kind;
        const isValue = [this.value, undefined].includes(value); 
        return isKind && isValue;
    }

    isInside(...kinds: string[]): boolean {
        return kinds.includes(this.kind);
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
        const rgx = {
            kind: /\w+/.source,
            value: /[\s\S]*/.source,
            fileName: /[\w\-\.]+/.source,
            line: /\d+/.source,
            column: /\d+/.source,
            tokenIndex: /\d+/.source,
        }

        const fullRegex = new RegExp(
            `^(${rgx.kind}) < (${rgx.value}) >` +
            ` (${rgx.fileName}):(${rgx.line}):(${rgx.column})` +
            ` \\((${rgx.tokenIndex})\\)$`
        );

        const opt_matchArr = fullRegex.exec(stringToken);
        if (opt_matchArr == null) {
            throw new Error(`Token string does not follow the format! ${stringToken}`);
        } else if (opt_matchArr.length !== 7) {
            throw new Error(`Token string does not have enough information! ${stringToken}`);
        }

        const [, kind, value, fileName, ln, col, tokenIndex] = opt_matchArr;

        // using value!, after performing the length check (opt_matchArr.length !== 7)
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

