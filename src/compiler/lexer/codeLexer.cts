
import { regexTokens } from "../tokens/regexTokens.cjs"
import { reservedKeywords } from "../tokens/reservedKeywords.cjs"
import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"
import { Lexer } from "./lexer.cjs"



export class CodeLexer extends Lexer {

  tokenize() {
    while (this.pos < this.source.length) {
      const token = this.getToken();
      this.tokens.push(token);
    }
    return this.tokens;
  }

  getToken(): Token {
    type RegexTokenKeys = keyof typeof regexTokens;
    for (const kind of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex: RegExp = regexTokens[kind];
      const opt_Match = this.matchCurrentSource(regex);
      if (opt_Match !== null) {
        const value = opt_Match[0];
        this.pos += value.length;

        if (kind === "WHITESPACE") continue;
        
        return new Token(
            this.checkReserved(kind, value), 
            value, 
            new Location("test.oph", 1, 1, 1)
        );
      }
    }
    throw new Error(`failed lexing! invalid token ${this.getCurrentSource()} found`);
  }

  checkReserved(kind: string, value: string) {
    if (kind !== "KEYWORD") return kind;

    type ReservedKeywordKeys = keyof typeof reservedKeywords;
    for (const keywordKind of Object.keys(reservedKeywords) as ReservedKeywordKeys[]) {
      const keywordArray = reservedKeywords[keywordKind];
      if (keywordArray.includes(value)) return keywordKind;
    }
    return "IDENTIFIER";
  }

  getTemplatePart() {
    const chars: Array<string> = [];
    let templateType: string;
    while (this.pos < this.source.length) {
      const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
      const matchesBacktick = this.matchCurrentSource(regexTokens.BACKTICK) !== null;
        if (matchesOpenExpr || matchesBacktick) {
          break;
        } else {
        chars.push(this.source[this.pos]);
        this.pos++;
        }
    }
    return new Token(
      "TEMPLATE_PART",
      chars.join(""),
      new Location("test.oph", 1, 1, 1)
    );
  }
}
