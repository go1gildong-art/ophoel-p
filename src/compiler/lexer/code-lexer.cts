
import { regexTokens } from "../tokens/regex-tokens.cjs"
import { reservedKeywords } from "../tokens/reserved-keywords.cjs"
import { Token } from "../tokens/token.cjs"
import { Lexer } from "./lexer.cjs"
import { TokenStream } from "../tokens/token-stream.cjs"
import { PreservedComment } from "../../compiler-old/ast"

enum LexerState {
  PROGRAM_CODE,
  TEMPLATE_STRING,
  TEMPLATE_INNER_EXPR
}

export class CodeLexer extends Lexer<LexerState> {

  public tokenize() {
    this.state.push(LexerState.PROGRAM_CODE);

    while (this.pos < this.source.length) {
      const token = this.getToken();
      this.tokens.push(token);
    }
    return this.tokens;
  }

  private getToken(): Token {  
    if (this.isState(LexerState.TEMPLATE_STRING)) return this.getTemplatePart();
    else return this.getRegularToken();
  }

  private getRegularToken(): Token {
    type RegexTokenKeys = keyof typeof regexTokens;
    for (const kind of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex = regexTokens[kind];
      const opt_Match = this.matchTail(regex);
      if (opt_Match == null) continue;

      const token = new Token(
        this.checkKeyword(kind, opt_Match[0]),
        opt_Match[0],
        this.getLocation()
      );
      
      this.pos += value.length;

      if (token.is("WHITESPACE")) continue;
      else if (token.is("BACKTICK") && !this.isState(LexerState.TEMPLATE_STRING) && !this.tokens.at(-1)?.is("TEMPLATE_PART")) {
        this.state.push(LexerState.TEMPLATE_STRING);
      
      } else if (token.is("RBRACE") && this.isState(LexerState.TEMPLATE_INNER_EXPR)) {
        this.state.pop();
      
      }

      
      return token;
    }
    throw new Error(`failed lexing! invalid token ${this.getTail()} found`);
  }


  private updateState(token: Token) {
    switch (token.kind) {
      case "OPENEXPR":
        this.state.push(LexerState.TEMPLATE_INNER_EXPR);
        break;

      case "RBRACE":
        if (this.isState(LexerState.TEMPLATE_INNER_EXPR)) this.state.pop();
        break;

      case "BACKTICK":
        
    }

    else if (token.is("BACKTICK") && !this.isState(LexerState.TEMPLATE_STRING) && !this.tokens.at(-1)?.is("TEMPLATE_PART")) {
        this.state.push(LexerState.TEMPLATE_STRING);
      
      } else if (token.is("RBRACE") && this.isState(LexerState.TEMPLATE_INNER_EXPR)) {
        this.state.pop();
      
      }


    if (match === "openExpr") this.state.push(LexerState.TEMPLATE_INNER_EXPR);
    else this.state.pop();
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

    const tail = this.getTail();
    const {match, index} = Object.entries({
      openExpr: tail.indexOf("${"),
      backtick: tail.indexOf("`")
    })
      .map(entry => ({ match: entry[0], index: entry[1] }))
      .filter(entry => entry.index !== -1)
      .sort((a, b) => a.index - b.index)[0]
      ?? { match: "none", index: tail.length };

    if (match === "openExpr") this.state.push(LexerState.TEMPLATE_INNER_EXPR);
    else this.state.pop();

    const token = new Token(
      "TEMPLATE_PART",
      tail.slice(index),
      this.getLocation()
    );

    this.pos += index;
    return token;
  }
}
