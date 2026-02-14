import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"

export abstract class Lexer {
  source: string;
  pos: number = 0;
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

  abstract tokenize(): Array<Token>

  getCurrentLocation(): Location {
    const processedString = this.source.slice(this.pos);
    const splitString = processedString.split("\n");

    const ln = splitString.length;
    const col = splitString[splitString.length - 1].length;

    return new Location(this.fileName, ln, col, this.tokens.length);
  }
}
