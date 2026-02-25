import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class IntLIteral extends Expression {
    kind = "IntLiteral";
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}