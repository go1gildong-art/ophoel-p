// test change for github

// import { regexTokens } from "./tokens/regexTokens.cjs"
// import { reservedKeywords } from "./tokens/reservedKeywords.cjs"
import { Token } from "../tokens/token.cjs"
// import { Location } from "./metadata.cjs"

type LexerState = "code" 
| "templateStrng";

export abstract class Lexer {
  source: string;
  pos: number;
  tokens: Array<Token> = [];
  stateStack: Array<LexerState> = ["code"];

  constructor(source: string, startPos: number = 0) {
    this.source = source;
    this.pos = startPos;
  }

  getCurrentSource(): string {
    return this.source.slice(this.pos);
  }

  matchCurrentSource(regex: RegExp) {
    return this.getCurrentSource().match(regex);
  }

  getCurrentState(): LexerState {
    return this.stateStack[this.stateStack.length - 1];
  }

  popCurrentState(): void {
    this.stateStack.pop();
  }

  abstract tokenize(): Array<Token>
  appendToken(token: Token): void { this.tokens.push(token); }
  appendTokens(tokens: Array<Token>): void { this.tokens.push(...tokens)}
}
