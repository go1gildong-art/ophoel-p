// test change for github

import { regexTokens } from "./tokens/regexTokens.cjs"
// import { reservedKeywords } from "./tokens/reservedKeywords.cjs"
import { Token } from "./tokens/token.cjs"
type Token_t = Token;
import { Location } from "./metadata.cjs"

class Lexer {
  source: string;
  pos: number = 0;
  tokens: Array<Token_t> = [];

  constructor(source: string) {
    this.source = source;
  }

  getCurrentSource() {
    return this.source.slice(this.pos);
  }

  tokenize(): Array<Token_t> {
    while (this.pos < this.source.length) {
      this.tokens.push(this.getToken());
    }
    
    return this.tokens;
  }

  getToken(): Token_t {
    type RegexTokenKeys = keyof typeof regexTokens;
    for (const key of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex: RegExp = regexTokens[key];
      const optMatch = this.getCurrentSource().match(regex);
      console.log("aaa",optMatch);

      if (optMatch !== null) {
        const token = optMatch[0];
        this.pos += token.length;

        if (key === "WHITESPACE") continue;

        return new Token(key, token, new Location("test.oph", 1, 1, 1));
      }

    }
    // when none matched
    throw new Error(`failed lexing! invalid token ${this.getCurrentSource()} found`);
  }
}

const src = "AAA eee ii OO u";
const lexlex = new Lexer(src);
console.log(lexlex.tokenize());