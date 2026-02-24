import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class BoolLiteral extends Expression {
    kind = "BoolLiteral";
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}