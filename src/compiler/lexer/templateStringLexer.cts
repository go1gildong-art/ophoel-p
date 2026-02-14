/*
import { regexTokens } from "../tokens/regexTokens.cjs"
import { reservedKeywords } from "../tokens/reservedKeywords.cjs"
import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"
import { Lexer } from "./lexer.cjs"
import { CodeLexer } from "./codeLexer.cjs"

export class TemplateStringLexer extends Lexer {

  tokenize() {
    while (this.pos < this.source.length) {
      this.tokens.push(this.getToken());
    }
    return this.tokens;
  }

  getToken(): Token {
    type RegexTokenKeys = keyof typeof regexTokens;
    for (const kind of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex: RegExp = regexTokens[kind];
      const optMatch = this.matchCurrentSource(regex);

      if (optMatch !== null) {
        const value = optMatch[0];
        this.pos += value.length;
        if (kind === "WHITESPACE") continue;
        
        return new Token(this.checkReserved(kind), value, new Location("test.oph", 1, 1, 1));
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
}
  */