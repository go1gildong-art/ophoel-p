import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export class StringLiteral implements Expression {
    kind = "StringLiteral";
    raw: string;
    location: Location;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}