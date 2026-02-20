import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"
import { TokenStream } from "../tokens/token-stream.cjs";

export abstract class Lexer <state_T>{
  protected readonly source: string;
  protected pos = 0;
  protected tokens: TokenStream = new TokenStream([]);
  protected readonly fileName: string;
  protected state: state_T[] = [];

  public constructor(source: string, fileName: string, startPos?: number) {
    this.source = source;
    this.fileName = fileName;
    if (startPos) this.pos = startPos;
  }

  protected getCurrentSource(): string {
    return this.source.slice(this.pos);
  }

  protected matchCurrentSource(regex: readonly RegExp) {
    return this.getCurrentSource().match(regex);
  }

  protected peekToken() {
    return this.tokens.at(-1);
  }

  protected peekState() {
    return this.state.at(-1);
  }

  protected isState(state: readonly state_T) {
    return this.peekState() === state;
  }

  public abstract tokenize(): TokenStream

  protected getCurrentLocation(tokenValue: string): Location {
    const splitString = this.source
      .slice(0, this.pos - tokenValue.length)
      .split("\n");

    const ln = splitString.length;
    const col = (splitString.at(-1)?.length ?? 0) + 1

    return new Location(this.fileName, ln, col, this.tokens.length());
  }

  
}
