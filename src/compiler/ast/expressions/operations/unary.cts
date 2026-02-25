import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export enum UnaryOperator {
    INCREMENT,
    DECREMENT,

    LOGIC_NOT
};

export class UnaryOperation implements Expression {
    kind = "UnaryOperation";
    right: Expression;
    operator: UnaryOperator;
    location: Location;

    constructor(operator: UnaryOperator, right: Expression, location: Location) {
        this.right = right;
        this.operator = operator;
        this.location = location;
    }
}