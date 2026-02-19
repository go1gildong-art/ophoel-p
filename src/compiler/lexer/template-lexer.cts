
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
            const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
            if (matchesOpenExpr) {
                this.tokens.push(...this.getInnerExpression().tokens);
            } else {
                this.tokens.push(this.getTemplatePart());
            }
        }
        return this.tokens;
    }

    getInnerExpression(): TokenStream {
        const startPos = this.pos;
        
        // preset for consuming ${ at the beginning
        let depth = 1;
        this.pos += 2;

        while (this.pos < this.source.length) {
            const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
            const matchesLBrace = this.matchCurrentSource(regexTokens.LBRACE) !== null;
            const matchesRBrace = this.matchCurrentSource(regexTokens.RBRACE) !== null;

            if (matchesOpenExpr || matchesLBrace) depth++;
            if (matchesRBrace) depth--;
            if (depth <= 0) break;
        }

        // preset for consuming } at the end
        this.pos++;

        return new CodeLexer(this.source, this.fileName, startPos).tokenize();
    }

    getTemplatePart(): Token {
        const chars: Array<string> = [];
        while (this.pos < this.source.length) {
            const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
            const matchesBacktick = this.matchCurrentSource(regexTokens.BACKTICK) !== null;

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