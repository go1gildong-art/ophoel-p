import { Token } from "../../../../tokens/token.cjs"

export class UnitCase {
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