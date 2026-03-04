import { ASTNode } from "../ast/ast.cjs"
import { Location } from "../metadata.cjs";
import { TokenPredicate, TokenStream } from "../tokens/token-stream.cjs"
import { Token } from "../tokens/token.cjs";
import { OphoelParseError } from "./parse-error.cjs";


export abstract class Parser<config_T> {
    pos = 0;

    constructor(
        protected tokens: TokenStream,
        protected config?: config_T) { }

    abstract parse(): ASTNode;

    getTail(): TokenStream { return this.tokens.slice(this.pos); }
    peek() { return this.tokens.at(this.pos); }
    eat() { return this.tokens.at(this.pos++); }
    check(kind: string, value?: string) { return this.peek()?.is(kind, value) ?? false; }
    checkInside(...kinds: string[]) { return this.peek()?.isInside(...kinds); }

    expect(kind: string, value?: string) {
        if (this.check(kind, value)) return this.eat()!; // this.check() guarantees peek() isn't null
        else {
            const msg = `At token index ${this.pos}, Expected ${kind} : ${value ?? "(any value)"} `
                + `but got ${this.peek()?.kind} : ${this.peek()?.value}`;
            throw new OphoelParseError(msg, this.peek()?.location);
        }
    }

    getBetween(fromPredicate: TokenPredicate, toPredicate: TokenPredicate, thisArg?: any) {
        const tokens = this.getTail().getBetween(fromPredicate, toPredicate, thisArg);
        this.pos += tokens.length();
        return tokens;
    }

    getUntil(predicate: TokenPredicate, thisArg?: any) {
        const tokens = this.getTail().getUntil(predicate, thisArg);
        this.pos += tokens.length();
        return tokens;
    }


}