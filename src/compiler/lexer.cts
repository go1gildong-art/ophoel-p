// test change for github

import { regexTokens } from "./tokens/regexTokens.cjs"
import { reservedKeywords } from "./tokens/reservedKeywords.cjs"
import { Token } from "./tokens/token.cjs"
import { Location } from "./metadata.cjs"

abstract class Lexer {
  source: string;
  pos: number = 0;
  tokens: Array<Token> = [];

  constructor(source: string) {
    this.source = source;
  }

  getCurrentSource(): string {
    return this.source.slice(this.pos);
  }

  tokenize(): Array<Token>;
  appendToken(token: Token): void { this.tokens.push(token); }
  appendTokens(tokens: Array<Token>): void { this.tokens.push(...tokens)}
}

class CodeLexer extends Lexer {

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
      const optMatch = this.getCurrentSource().match(regex);

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

const src = "AAA eee ii OO u";
const lexlex = new CodeLexer(src);
console.log(lexlex.tokenize());