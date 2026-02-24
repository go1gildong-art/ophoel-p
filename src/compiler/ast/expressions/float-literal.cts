import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class FloatLIteral extends Expression {
    kind = "FloatLiteral";
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}