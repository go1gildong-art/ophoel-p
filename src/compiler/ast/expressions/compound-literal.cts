import { Expression } from "../ast.cjs";
import { OphoelTypes } from "../types.cjs";
import { Location } from "../../metadata.cjs";

export class CompoundLiteral extends Expression {
    kind = "CompoundLiteral";
    
    constructor(keys: string[], values: Expression[], location: Location) {
        this.keys = keys;
        this.values = values;
        this.location = location;
    }
}