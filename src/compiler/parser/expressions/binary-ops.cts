import { ASTs } from "../../../ast/ast-collection.cjs";
import { Expression } from "../../../ast/ast.cjs";
import { BinaryOperator } from "../../../ast/expressions/operations.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const binaryOps: ActionMap<Expression> = {
    OrExp_or(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_OR,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    OrExp(left) {
        return left.toAST(__filename);
    },

    AndExp_and(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_AND,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    AndExp(left) {
        return left.toAST(__filename);
    },

    CompareExp_eq(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_IS,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_neq(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.LOGIC_IS_NOT,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_gte(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_SLARGER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_lte(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_SSMALLER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_gt(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_LARGER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp_lt(left, _op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.CMPARE_SMALLER,
            right.toAST(__filename),
            getLoc(_op, __filename)
        );
    },

    CompareExp(left) {
        return left.toAST(__filename);
    },

    AddExp_plus(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.ADD,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    AddExp_minus(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.SUBTRACT,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    AddExp(left) {
        return left.toAST(__filename);
    },

    MulExp_multiply(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.MULTIPLY,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    MulExp_divide(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.DIVIDE,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    MulExp_remainder(left, op, right) {
        return new ASTs.BinaryOperation(
            left.toAST(__filename),
            BinaryOperator.REMAINDER,
            right.toAST(__filename),
            getLoc(op, __filename)
        );
    },

    MulExp(left) {
        return left.toAST(__filename);
    }
}
