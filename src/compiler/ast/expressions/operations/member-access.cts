import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class MemberAccess extends Expression {
    kind = "MemberAccess";

    constructor(left: Expression, member: string, location: Location) {
        [this.left, this.member] = [left, member];
        this.location = location;
    }
}