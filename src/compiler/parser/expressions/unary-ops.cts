import { ASTs } from "../../../ast/ast-collection.cjs";
import { Expression } from "../../../ast/ast.cjs";
import { UnaryOperator } from "../../../ast/expressions/operations.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const unaryOps: ActionMap<Expression> = {
    UnaryExp_preIncrement(op, right) {
        return new ASTs.PreUnary(
            UnaryOperator.INCREMENT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    UnaryExp_preDecrement(op, right) {
        return new ASTs.PreUnary(
            UnaryOperator.DECREMENT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    UnaryExp_preNot(op, right) {
        return new ASTs.PreUnary(
            UnaryOperator.LOGIC_NOT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    UnaryExp(left) {
        return left.toAST(__filename);
    },

    PostUnaryExp_postIncrement(left, op) {
        return new ASTs.PostUnary(
            UnaryOperator.INCREMENT,
            left.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    PostUnaryExp_postDecrement(left, op) {
        return new ASTs.PostUnary(
            UnaryOperator.DECREMENT,
            left.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    PostUnaryExp(left) {
        return left.toAST(__filename);
    }
}
