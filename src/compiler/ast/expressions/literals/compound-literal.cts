import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";
import { OphoelValue } from "../../types.cjs";

export class CompoundLiteral implements Expression {
    kind = "CompoundLiteral";
    location: Location;
    keys: string[];
    values: Expression[];

    constructor(keys: string[], values: Expression[], location: Location) {
        this.keys = keys;
        this.values = values;
        this.location = location;
    }
}