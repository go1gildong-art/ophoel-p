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
export class BinaryOperation implements Expression {
    kind = "BinaryOperation";
    left: Expression;
    right: Expression;
    operator: BinaryOperator;
    location: Location;


    constructor(left: Expression, operator: BinaryOperator, right: Expression, location: Location) {
        [this.left, this.right] = [left, right];
        this.operator = operator;
        this.location = location;
    }
}


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

export class MemberAccess implements Expression {
    kind = "MemberAccess";
    left: Expression;
    member: string;
    location: Location;

    constructor(left: Expression, member: string, location: Location) {
        [this.left, this.member] = [left, member];
        this.location = location;
    }
}
