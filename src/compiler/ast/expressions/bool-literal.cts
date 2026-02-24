import { Expression } from "../ast.cjs";
import { OphoelTypes } from "../types.cjs";
import { Location } from "../../metadata.cjs";

export class BoolLiteral extends Expression {
    kind = "BoolLiteral";
    type = { kind: OphoelTypes.BOOL };
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}