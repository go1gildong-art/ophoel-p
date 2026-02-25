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

    constructor(
        public left: Expression, 
        public operator: BinaryOperator, 
        public right: Expression, 
        public location: Location) {}
}


export enum UnaryOperator {
    INCREMENT,
    DECREMENT,

    LOGIC_NOT
};
export class UnaryOperation implements Expression {
    kind = "UnaryOperation";

    constructor(
        public operator: UnaryOperator, 
        public right: Expression, 
        public location: Location) {}
}

export class IndexAccess implements Expression {
    kind = "IndexAccess";

    constructor(
        public left: Expression, 
        public index: Expression, 
        public location: Location) {}
}

export class MemberAccess implements Expression {
    kind = "MemberAccess";

    constructor(
        public left: Expression, 
        public member: string, 
        public location: Location) {}
}
