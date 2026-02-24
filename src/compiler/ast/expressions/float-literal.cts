import { Expression } from "../ast.cjs";
import { OphoelTypes } from "../types.cjs";
import { Location } from "../../metadata.cjs";

export class FloatLIteral extends Expression {
    kind = "FloatLiteral";
    type = { kind: OphoelTypes.FLOAT };
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}