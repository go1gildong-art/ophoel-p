import { Location } from "../metadata.cjs"
import { TokenStream } from "../tokens/token-stream.cjs";

export abstract class Lexer <state_T>{
  protected tokens: TokenStream = new TokenStream([]);
  protected state: state_T[] = [];

  public constructor(
      protected readonly source: string, 
      protected readonly fileName: string, 
      protected pos: number = 0) {}

  protected getTail(): string { return this.source.slice(this.pos); }

  protected matchTail(regex: RegExp) { return this.getTail().match(regex); }

  protected peekToken() { return this.tokens.at(-1); }

  protected isState(...state: state_T[]) { return state.includes(this.peekState()); }

  public abstract tokenize(): TokenStream

  protected getLocation(): Location {
    const splitString = this.source
      .slice(0, this.pos)
      .split("\n");

    const ln = splitString.length;
    const col = (splitString.at(-1)?.length ?? 0) + 1

    return new Location(this.fileName, ln, col, this.tokens.length());
  } 
}
