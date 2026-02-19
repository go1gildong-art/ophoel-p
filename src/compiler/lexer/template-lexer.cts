
import { regexTokens } from "../tokens/regex-tokens.cjs"
import { reservedKeywords } from "../tokens/reserved-keywords.cjs"
import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"
import { Lexer } from "./lexer.cjs"
import { CodeLexer } from "./code-lexer.cjs"
import { TokenStream } from "../tokens/token-stream.cjs"

export class TemplateLexer extends Lexer {

    tokenize() {
        while (this.pos < this.source.length) {
            const token = this.getToken();
            this.tokens.push(token);
        }
        return this.tokens;
    }

    getToken(): Token {
        if (this.peekToken()?.is("BACKTICK")) {
            return this.getTemplatePart();
        }

        type RegexTokenKeys = keyof typeof regexTokens;
        for (const kind of Object.keys(regexTokens) as RegexTokenKeys[]) {
            const regex: RegExp = regexTokens[kind];
            const opt_Match = this.matchCurrentSource(regex);

            if (opt_Match == null) continue;

            const value = opt_Match[0];
            this.pos += value.length;

            if (kind === "WHITESPACE") continue;
            return new Token(
                this.checkKeyword(kind, value),
                value,
                this.getCurrentLocation(value)
            );
        }
        throw new Error(`failed lexing! invalid token ${this.getCurrentSource()} found`);
    }

    checkKeyword(kind: string, value: string) {
        if (kind !== "KEYWORD") return kind;

        type ReservedKeywordKeys = keyof typeof reservedKeywords;
        for (const keywordKind of Object.keys(reservedKeywords) as ReservedKeywordKeys[]) {

            const keywordArray = reservedKeywords[keywordKind];
            if (keywordArray.includes(value)) return keywordKind;
        }
        return "IDENTIFIER";
    }

    getInnerExpression(): TokenStream {
        const startPos = this.pos;
        
        // preset for consuming ${ at the beginning
        let depth = 1;
        const chars: string[] = ["$", "{"];
        this.pos += 2;

        while (this.pos < this.source.length) {
            const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
            const matchesLBrace = this.matchCurrentSource(regexTokens.LBRACE) !== null;
            const matchesRBrace = this.matchCurrentSource(regexTokens.RBRACE) !== null;

            if (matchesOpenExpr || matchesLBrace) depth++;
            if (matchesRBrace) depth--;

            if (depth <= 0) break;
            chars.push(this.source[this.pos] ?? "");
        }

        // preset for consuming } at the end
        chars.push("}");
        this.pos++;

        return new CodeLexer(chars.join(""), this.fileName).tokenize();
    }

    getTemplatePart(): Token {
        const chars: Array<string> = [];
        while (this.pos < this.source.length) {
            const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
            const matchesBacktick = this.matchCurrentSource(regexTokens.BACKTICK) !== null;

            if (matchesOpenExpr) {
                this.tokens





            }


            if (matchesOpenExpr || matchesBacktick) {
                break;
            } else {
                chars.push(this.source[this.pos] ?? "");
                this.pos++;
            }
        }
        return new Token(
            "TEMPLATE_PART",
            chars.join(""),
            this.getCurrentLocation(chars.join(""))
        );
    }
}