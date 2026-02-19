import { Token } from "../../../../tokens/token.cjs"
import { GoldenUnit } from "../../../../test-resources/golden-test.cjs";
import { TokenStream } from "../../../../tokens/token-stream.cjs";
export class UnitCase implements GoldenUnit<string, TokenStream>{
    title: string;
    description: string;
    source: string;
    expectation: TokenStream;
    
    constructor(title: string, description: string, source: string, expectation: string[]) {
        this.title = title;
        this.description = description;
        this.source = source;
        this.expectation = new TokenStream(expectation.map(stringToken => Token.fromString(stringToken)));
    }
}