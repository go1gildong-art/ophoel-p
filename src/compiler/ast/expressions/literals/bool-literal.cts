import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export class BoolLiteral implements Expression {
    kind = "BoolLiteral";
    raw: string;
    location: Location;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}