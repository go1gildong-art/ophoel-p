import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"

export abstract class Lexer {
  source: string;
  pos = 0;
  tokens: Array<Token> = [];
  fileName: string;

  constructor(source: string, fileName: string) {
    this.source = source;
    this.fileName = fileName;
  }

  getCurrentSource(): string {
    return this.source.slice(this.pos);
  }

  matchCurrentSource(regex: RegExp) {
    return this.getCurrentSource().match(regex);
  }

  peekToken() {
    return this.tokens.at(-1);
  }

  abstract tokenize(): Array<Token>

  getCurrentLocation(tokenValue: string): Location {
    const splitString = this.source
      .slice(0, this.pos - tokenValue.length)
      .split("\n");

    const ln = splitString.length;
    const col = (splitString.at(-1)?.length ?? 0) + 1

    return new Location(this.fileName, ln, col, this.tokens.length);
  }
}
