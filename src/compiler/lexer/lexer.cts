// test change for github

import { regexTokens } from "./tokens/regexTokens.cjs"
import { reservedKeywords } from "./tokens/reservedKeywords.cjs"
import { Token } from "./tokens/token.cjs"
import { Location } from "./metadata.cjs"

export abstract class Lexer {
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




const src = "AAA eee ii OO u";
const lexlex = new CodeLexer(src);
console.log(lexlex.tokenize());