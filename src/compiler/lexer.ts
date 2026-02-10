import { regexTokens } from "./tokens/regexTokens";
import { reservedKeywords } from "./tokens/reservedKeywords";
import { Token } from "./tokens/token";
import { Location } from "./metadata";

class Lexer {
  source
  pos = 0;
  tokens: Array<Token> = [];

  constructor(source: string) {
    this.source = source;
  }

  getCurrentSource() {
    return this.source.slice(this.pos);
  }

  tokenize(): Array<Token> {
    return yourAss;
  }

  getToken() {
    type RegexTokenKeys = keyof typeof regexTokens;
    for (const key of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex: RegExp = regexTokens[key];
      const 
      this.getCurrentSource().match(regex)
    }
  }
}