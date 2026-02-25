import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export enum UnaryOperator {
    INCREMENT,
    DECREMENT,

    LOGIC_NOT
};

export class UnaryOperation extends Expression {
    kind = "UnaryOperation";

    constructor(operator: UnaryOperator, right: Expression, location: Location) {
        this.right = right;
        this.operator = operator;
        this.location = location;
    }
}