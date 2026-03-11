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
    ) { return new ParserState(pos, tokens, config); }

    branch() { return new ParserStateMut(this.pos, this.tokens, this.config); }
}

export class ParserStateMut<config_T = unknown> {
    constructor(
        public pos: number = 0,
        public tokens: TokenStream,
        public config: config_T) { }
 
    snapshot() { return new ParserState(this.pos, this.tokens, this.config); }
}

export type ParseResult<config_T = unknown, result_T = unknown, error_T = unknown> =
    | { success: true; result: result_T; state: ParserState<config_T> }
    | { success: false; error: error_T};

export abstract class Parser<config_T> {

    protected state: ParserStateMut<config_T>;
    constructor(state: ParserState<config_T>) { this.state = state.branch(); }

    abstract parse(): ParseResult<ASTNode, config_T>;

    branch(): this { 
        const Constructor = this.constructor as new (state: ParserState<config_T>) => this;
        return Constructor(this.state.snapshot());
    }

    getTail(): TokenStream { return this.state.tokens.slice(this.state.pos); }

    peek(index: number = 0) { return this.state.tokens.at(this.state.pos + index); }

    eat() { return this.state.tokens.at(this.state.pos++); }

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
        return tokens;
    }

    getUntil(predicate: TokenPredicate, thisArg?: any) {
        const tokens = this.getTail().getUntil(predicate, thisArg);
        const newPos = this.state.pos + tokens.length();
        return tokens
    }
}

