import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class IndexAccess extends Expression {
    kind = "IndexAccess";

    constructor(left: Expression, index: Expression, location: Location) {
        [this.left, this.index] = [left, index];
        this.location = location;
    }
}