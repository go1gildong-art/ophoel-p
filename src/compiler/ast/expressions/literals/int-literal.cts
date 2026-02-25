import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export class IntLiteral implements Expression {
    kind = "IntLiteral";
    raw: string;
    location: Location;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}