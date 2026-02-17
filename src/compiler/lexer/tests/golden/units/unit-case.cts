import { Token } from "../../../../tokens/token.cjs"
import { GoldenUnit } from "../../../../test-resources/golden-test.cjs";
export class UnitCase implements GoldenUnit<string, Token[]>{
    title: string;
    description: string;
    source: string;
    expectation: Token[];
    
    constructor(title: string, description: string, source: string, expectation: string[]) {
        this.title = title;
        this.description = description;
        this.source = source;
        this.expectation = expectation.map(stringToken => Token.fromString(stringToken));
    }
}