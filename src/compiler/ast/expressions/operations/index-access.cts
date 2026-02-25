import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export class IndexAccess implements Expression {
    kind = "IndexAccess";
    left: Expression;
    index: Expression;
    location: Location;


    constructor(left: Expression, index: Expression, location: Location) {
        [this.left, this.index] = [left, index];
        this.location = location;
    }
}