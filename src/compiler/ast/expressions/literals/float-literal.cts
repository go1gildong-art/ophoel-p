import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export class FloatLIteral implements Expression {
    kind = "FloatLiteral";
    raw: string;
    location: Location;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}