// const Location = require("../metadata.cjs");
import { Location } from "../metadata.cjs"
type Location_t = InstanceType<typeof Location>;

export class Token {
    kind: string;
    value: string;
    location: Location_t;

    constructor(kind: string, value: string, location: Location_t) {
        this.kind = kind;
        this.value = value;
        this.location = location;
    }

    // 1. enable by-value comparison between strings
    // 2. reform object to make it more concise and readable
    toString(): string {
        return `${this.kind} "${this.value}" ${this.location.toString()}`;
    }

    static fromString(stringToken: string): Token {
        const TokenRegexes = {
            kind: /\w+/,
            value: /[\s\S]+/,
            fileName: /[\w\.]+/,
            line: /\d+/,
            column: /\d+/,
            tokenIndex: /\d+/,
        }

        const fullRegex = new RegExp(
            `^(${TokenRegexes.kind.source}) "(${TokenRegexes.value.source})"`
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

