import { Expression } from "../ast.cjs";
import { OphoelTypes } from "../types.cjs";
import { Location } from "../../metadata.cjs";

export class StringLiteral extends Expression {
    kind = "StringLiteral";
    type = { kind: OphoelTypes.STRING };
    raw: string;

    constructor(source: string, location: Location) {
        this.raw = source;
        this.location = location;
    }
}