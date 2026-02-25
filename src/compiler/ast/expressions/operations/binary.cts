import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export enum BinaryOperator {
    ADD,
    SUBTRACT,
    MULTIPLY,
    DIVIDE,
    REMAINDER,

    LOGIC_IS,
    LOGIC_IS_NOT,
    LOGIC_AND,
    LOGIC_OR,

    CMPARE_LARGER,
    CMPARE_SMALLER,
    CMPARE_SLARGER,
    CMPARE_SSMALLER
};

export class BinaryOperation extends Expression {
    kind = "BinaryOperation";

    constructor(left: Expression, operator: BinaryOperator, right: Expression, location: Location) {
        [this.left, this.right] = [left, right];
        this.operator = operator;
        this.location = location;
    }
}