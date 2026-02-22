
import { regexTokens } from "../tokens/regex-tokens.cjs"
import { reservedKeywords } from "../tokens/reserved-keywords.cjs"
import { Token } from "../tokens/token.cjs"
import { Lexer } from "./lexer.cjs"
import { TokenStream } from "../tokens/token-stream.cjs"

enum LexerState {
  PROGRAM_CODE,
  TEMPLATE_STRING,
  TEMPLATE_INNER_EXPRESSION
}
export class CodeLexer extends Lexer<LexerState> {

  public tokenize() {
    this.state.push(LexerState.PROGRAM_CODE);

    while (this.pos < this.source.length) {
      const token = this.getToken();
      this.tokens.push(token);
      console.log(this.tokens.length() - 1+ " " + this.fileName + " CURRENTSTATE: " + this.peekState())
    }
    return this.tokens;
  }

  private getToken(): Token {
    
    if (this.isState(LexerState.TEMPLATE_STRING)) {
      return this.getTemplatePart();
    }

    type RegexTokenKeys = keyof typeof regexTokens;
    for (const kind of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex: RegExp = regexTokens[kind];
      const opt_Match = this.matchTail(regex);

      if (opt_Match == null) continue;

      const value = opt_Match[0];
      this.pos += value.length;
      const token = new Token(
        this.checkKeyword(kind, value),
        value,
        this.getLocation(value)
      );

      if (token.is("WHITESPACE")) continue;
      else if (token.is("BACKTICK") && !this.isState(LexerState.TEMPLATE_STRING) && !this.tokens.at(-1)?.is("TEMPLATE_PART")) {
        console.log("AH");
        this.state.push(LexerState.TEMPLATE_STRING);
      
      } else if (token.is("RBRACE") && this.isState(LexerState.TEMPLATE_INNER_EXPRESSION)) {
        this.state.pop();
      
      }

      
      return token;
    }
    throw new Error(`failed lexing! invalid token ${this.getTail()} found`);
  }

  private checkKeyword(kind: string, value: string) {
    if (kind !== "KEYWORD") return kind;

    type ReservedKeywordKeys = keyof typeof reservedKeywords;
    for (const keywordKind of Object.keys(reservedKeywords) as ReservedKeywordKeys[]) {

      const keywordArray = reservedKeywords[keywordKind];
      if (keywordArray.includes(value)) return keywordKind;
    }
    return "IDENTIFIER";
  }

  private getTemplatePart(): Token {
    const startPos = this.pos;
    const [match, index] = Object.entries({
      none: this.getTail().length,
      nextOpenExpr: this.getTail().indexOf("${"),
      nextBacktick: this.getTail().indexOf("`")
    })
      .reduce((acc, [nextToken, index]) => (acc[1] > index && index !== -1) ? [nextToken, index] : acc)


    if (match === "nextOpenExpr") {
      this.state.push(LexerState.TEMPLATE_INNER_EXPRESSION);
    } else {
      this.state.pop();
    }

    this.pos += index;

    return new Token(
      "TEMPLATE_PART",
      this.source.slice(startPos, startPos + index),
      this.getLocation(this.source.slice(startPos, startPos + index))
    )
  }
}

import { unit } from "./tests/golden/units/test_template-edges.cjs"
const lexlex = new CodeLexer(unit.source, "template-edges.cts").tokenize().map(token => token.toString());
console.log(lexlex);