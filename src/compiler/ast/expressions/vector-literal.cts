import { Expression } from "../ast.cjs";
import { OphoelTypes } from "../types.cjs";
import { Location } from "../../metadata.cjs";

export class VectorLiteral extends Expression {
    kind = "VectorLiteral";
    type = { kind: OphoelTypes.VECTOR, length, entryType };
    raw: string;

    constructor(entries: ASTNode[], location: Location) {
        this.raw = source;
        this.location = location;

        this.type.length = entries.length;
        this.type.entryType = entries[0]?.type ?? { kind: OphoelTypes.NULL };
    }
}