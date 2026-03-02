
import { regexTokens } from "../tokens/regex-tokens.cjs"
import { reservedKeywords } from "../tokens/reserved-keywords.cjs"
import { Token } from "../tokens/token.cjs"
import { Lexer } from "./lexer.cjs"

enum LexerState {
  PROGRAM,
  TMPL_STRING,
  TMPL_PENDING,
  TMPL_IN_EXPR
}

export class CodeLexer extends Lexer<LexerState> {

  public tokenize() {
    this.state.push(LexerState.PROGRAM);

    while (this.pos < this.source.length) {
      const token = this.getToken();
      this.tokens.push(token);
    }
    return this.tokens;
  }

  private getToken(): Token {
    const token = 
      this.isState(LexerState.TMPL_STRING)
      ? this.getTemplatePart()
      : this.getRegularToken();

    this.updateState(token);
    return token;
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

      this.pos += opt_Match[0].length;
      if (token.is("WHITESPACE")) continue;
      return token;
    }
    throw new Error(`failed lexing! invalid token ${this.getTail()} found`);
  }


  private updateState(token: Token) {
    switch (token.kind) {
      case "OPENEXPR":
        if (this.isState(LexerState.TMPL_PENDING)) {
          this.state.pop();
          this.state.push(LexerState.TMPL_IN_EXPR);
        }
        break;

      case "RBRACE":
        if (this.isState(LexerState.TMPL_IN_EXPR)) this.state.pop();
        break;

      case "BACKTICK":
        if (this.isState(LexerState.TMPL_PENDING)) {
          this.state.pop();
          this.state.pop();
        } else if (this.isState(LexerState.PROGRAM, LexerState.TMPL_IN_EXPR)) {
          this.state.pop();
          this.state.push(LexerState.TMPL_IN_EXPR);
        }
        break;
        
      case "TEMPLATE_PART":
        this.state.push(LexerState.TMPL_PENDING);
    }
  }

  private checkKeyword(kind: string, value: string) {
    if (kind !== "KEYWORD") return kind;

    const keyword = Object.entries(reservedKeywords)
    .map(entry => ({ kind: entry[0], keywords: entry[1] }))
    .filter(entry => entry.keywords.includes(value))
    [0]?.kind
    ?? "IDENTIFIER";

    return keyword;
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

    const token = new Token(
      "TMPL_PART",
      tail.slice(index),
      this.getLocation()
    );

    this.state.push(LexerState.TMPL_PENDING);
    this.pos += index;
    return token;
  }
}
