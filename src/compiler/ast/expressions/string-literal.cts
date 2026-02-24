import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class StringLiteral extends Expression {
    kind = "StringLiteral";
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}