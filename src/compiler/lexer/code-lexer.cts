
import { regexTokens } from "../tokens/regex-tokens.cjs"
import { reservedKeywords } from "../tokens/reserved-keywords.cjs"
import { Token } from "../tokens/token.cjs"
import { Location } from "../metadata.cjs"
import { Lexer } from "./lexer.cjs"
import { TokenStream } from "../tokens/token-stream.cjs"

enum LexerState {
  PROGRAM_CODE,
  TEMPLATE_STRING,
  TEMPLATE_INNER_EXPRESSION
}
export class CodeLexer extends Lexer<LexerState> {

  tokenize() {
    this.state.push(LexerState.PROGRAM_CODE);

    while (this.pos < this.source.length) {
      const token = this.getToken();
      this.tokens.push(token);
    }
    return this.tokens;
  }

  getToken(): Token {
    console.log(this.tokens.length() + " " + this.fileName + " CURRENTSTATE: " + this.peekState())
    if (this.peekState() === LexerState.TEMPLATE_STRING) {
      return this.getTemplatePart();
    }

    type RegexTokenKeys = keyof typeof regexTokens;
    for (const kind of Object.keys(regexTokens) as RegexTokenKeys[]) {
      const regex: RegExp = regexTokens[kind];
      const opt_Match = this.matchCurrentSource(regex);

      if (opt_Match == null) continue;

      const value = opt_Match[0];
      this.pos += value.length;
      const token = new Token(
        this.checkKeyword(kind, value),
        value,
        this.getCurrentLocation(value)
      );

      if (kind === "WHITESPACE") continue;
      else if (token.is("BACKTICK") && this.peekState() !== LexerState.TEMPLATE_STRING) {
        this.state.push(LexerState.TEMPLATE_STRING);
      }
      else if (token.is("RBRACE") && this.peekState() === LexerState.TEMPLATE_INNER_EXPRESSION) {
        this.state.pop();
      }

      return token;
    }
    throw new Error(`failed lexing! invalid token ${this.getCurrentSource()} found`);
  }

  checkKeyword(kind: string, value: string) {
    if (kind !== "KEYWORD") return kind;

    type ReservedKeywordKeys = keyof typeof reservedKeywords;
    for (const keywordKind of Object.keys(reservedKeywords) as ReservedKeywordKeys[]) {

      const keywordArray = reservedKeywords[keywordKind];
      if (keywordArray.includes(value)) return keywordKind;
    }
    return "IDENTIFIER";
  }

  getTemplateString(): TokenStream {
    const startPos = this.pos;

    // preset for consuming ` at the beginning
    let depth = 1;
    this.pos += 2;

    while (this.pos < this.source.length) {
      const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
      const matchesLBrace = this.matchCurrentSource(regexTokens.LBRACE) !== null;
      const matchesRBrace = this.matchCurrentSource(regexTokens.RBRACE) !== null;

      if (matchesOpenExpr || matchesLBrace) depth++;
      if (matchesRBrace) depth--;
      if (depth <= 0) break;
    }

    // preset for consuming } at the end
    this.pos++;

    return new CodeLexer(this.source, this.fileName, startPos).tokenize();
  }

  getTemplatePart(): Token {
    const chars: Array<string> = [];
    while (this.pos < this.source.length) {
      const matchesOpenExpr = this.matchCurrentSource(regexTokens.OPENEXPR) !== null;
      const matchesBacktick = this.matchCurrentSource(regexTokens.BACKTICK) !== null;

      if (matchesOpenExpr) {
        this.state.push(LexerState.TEMPLATE_INNER_EXPRESSION);
        break;

      } else if (matchesBacktick) {
        this.state.pop();
        break;
      }

      else {
        chars.push(this.source[this.pos] ?? "");
        this.pos++;
      }
    }

    return new Token(
      "TEMPLATE_PART",
      chars.join(""),
      this.getCurrentLocation(chars.join(""))
    );
  }
}