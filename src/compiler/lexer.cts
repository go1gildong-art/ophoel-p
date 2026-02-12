// test change for github

import { regexTokens } from "./tokens/regexTokens.cjs"
// import { reservedKeywords } from "./tokens/reservedKeywords.cjs"
import { Token } from "./tokens/token.cjs"
type Token_t = Token;
import { Location } from "./metadata.cjs"

class Lexer {
  source
  pos = 0;
  tokens: Array<Token_t> = [];

  constructor(source: string) {
    this.source = source;
  }

  getCurrentSource() {
    return this.source.slice(this.pos);
  }

  tokenize(): Array<Token_t> {
    this.tokens.push(this.getToken());
    return this.tokens;
  }

  getToken(): Token_t {
    type RegexTokenKeys = keyof typeof regexTokens;
    for (const key of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex: RegExp = regexTokens[key];
      const optMatch = this.getCurrentSource().match(regex);
      console.log("aaa",optMatch);
      if (optMatch === null) {
      } else {
        let token: string;
        token = optMatch[0];
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