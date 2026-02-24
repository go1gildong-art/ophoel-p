import { Expression } from "../ast.cjs";
import { OphoelTypes } from "../types.cjs";
import { Location } from "../../metadata.cjs";

export class VectorLIteral extends Expression {
    kind = "VectorLiteral";
    type = { kind: OphoelTypes.VECTOR, length, entryType };
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}