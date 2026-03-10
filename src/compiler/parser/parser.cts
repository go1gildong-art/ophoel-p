import { ASTNode } from "../ast/ast.cjs"
import { Location } from "../metadata.cjs";
import { TokenPredicate, TokenStream } from "../tokens/token-stream.cjs"
import { Token } from "../tokens/token.cjs";
import { OphoelParseError } from "./parse-error.cjs";

export class ParserState<config_T = unknown> {

    constructor(
        public readonly pos: number = 0,
        public readonly tokens: TokenStream,
        public readonly config: config_T) { }

    replicate(
        pos = this.pos,
        tokens = this.tokens,
        config = this.config
    ) {
        return new ParserState(pos, tokens, config);
    }
}

type ParseResult<result_T, config_T> =
    | { success: true; result: result_T; state: ParserState<config_T> }
    | { success: false; error: string };

export abstract class Parser<config_T> {

    constructor(public readonly state: ParserState<config_T>) { }

    abstract parse(): ASTNode;

    getTail(): TokenStream { return this.state.tokens.slice(this.state.pos); }

    peek() { return this.state.tokens.at(this.state.pos); }

    eat() { return { result: this.peek(), state: this.state.replicate(this.state.pos + 1) }; }

    check(kind: string, value?: string) { return this.peek()?.is(kind, value) ?? false; }

    checkInside(...kinds: string[]) { return this.peek()?.isInside(...kinds); }

    expect(kind: string, value?: string) {
        if (this.check(kind, value)) return this.eat();
        else {
            const msg = `At token index ${this.state.pos}, Expected ${kind} : ${value ?? "(any value)"} `
                + `but got ${this.peek()?.kind} : ${this.peek()?.value}`;
            throw new OphoelParseError(msg, this.peek()?.location);
        }
    }

    getBetween(fromPredicate: TokenPredicate, toPredicate: TokenPredicate, thisArg?: any) {
        const tokens = this.getTail().getBetween(fromPredicate, toPredicate, thisArg);
        const newPos = this.state.pos + tokens.length();
        return { result: tokens, state: this.state.replicate(newPos) };
    }

    getUntil(predicate: TokenPredicate, thisArg?: any) {
        const tokens = this.getTail().getUntil(predicate, thisArg);
        const newPos = this.state.pos + tokens.length();
        return { result: tokens, state: this.state.replicate(newPos) };
    }
}

