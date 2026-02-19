import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"
import { TokenStream } from "../tokens/token-stream.cjs";

export abstract class Lexer <state_T>{
  source: string;
  pos = 0;
  tokens: TokenStream = new TokenStream([]);
  fileName: string;
  state: state_T[] = [];

  constructor(source: string, fileName: string, startPos?: number) {
    this.source = source;
    this.fileName = fileName;
    if (startPos) this.pos = startPos;
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

  peekState() {
    return this.state.at(-1);
  }

  abstract tokenize(): TokenStream

  getCurrentLocation(tokenValue: string): Location {
    const splitString = this.source
      .slice(0, this.pos - tokenValue.length)
      .split("\n");

    const ln = splitString.length;
    const col = (splitString.at(-1)?.length ?? 0) + 1

    return new Location(this.fileName, ln, col, this.tokens.length());
  }

  
}
