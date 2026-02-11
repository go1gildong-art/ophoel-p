import regexTokens from "./tokens/regexTokens"
import reservedKeywords from "./tokens/reservedKeywords"
import Token from "./tokens/token"
type Token_t = Token;
import Location from "./tokens/regexTokens"

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
      let token: string;

      if (optMatch === null) {
        throw new Error("failed lexing");
      } else {
        token = optMatch[0];
      }

      return new Token(key, token, new Location("test.oph", 1, 1, 1));
    }
    // after done
    return new Token("DONE", "done!", new Location("test.oph", 1, 1, 1));
  }
}

const src = "AAA eee ii OO u";
const lexlex = new Lexer(src);
console.log(lexlex.tokenize());