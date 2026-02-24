import { Expression } from "../ast.cjs";
import { OphoelTypes } from "../types.cjs";
import { Location } from "../../metadata.cjs";

export class IntLIteral extends Expression {
    kind = "IntLiteral";
    type = { kind: OphoelTypes.INT };
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}