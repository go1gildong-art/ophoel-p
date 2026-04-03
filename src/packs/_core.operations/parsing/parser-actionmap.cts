import { ASTs } from "../../../pack-combinator.cjs";
import { Expression } from "../../../ast.cjs";
import { BinaryOperator, UnaryOperator } from "../../../packs/_core.operations/nodes.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';
import { MacroCall, MemberAccess } from "../lispify.cjs";

export const actionMap: ActionMap<Expression> = {
    OrExp_or(left, _op, right) {
        return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.LOGIC_OR, right.toAST(__filename), getLoc(_op, __filename));
    },
    OrExp(left) { return left.toAST(__filename); },
    AndExp_and(left, _op, right) {
        return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.LOGIC_AND, right.toAST(__filename), getLoc(_op, __filename));
    },
    AndExp(left) { return left.toAST(__filename); },
    CompareExp_eq(left, _op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.LOGIC_IS, right.toAST(__filename), getLoc(_op, __filename)); },
    CompareExp_neq(left, _op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.LOGIC_IS_NOT, right.toAST(__filename), getLoc(_op, __filename)); },
    CompareExp_gte(left, _op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.CMPARE_SLARGER, right.toAST(__filename), getLoc(_op, __filename)); },
    CompareExp_lte(left, _op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.CMPARE_SSMALLER, right.toAST(__filename), getLoc(_op, __filename)); },
    CompareExp_gt(left, _op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.CMPARE_LARGER, right.toAST(__filename), getLoc(_op, __filename)); },
    CompareExp_lt(left, _op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.CMPARE_SMALLER, right.toAST(__filename), getLoc(_op, __filename)); },
    CompareExp(left) { return left.toAST(__filename); },
    AddExp_plus(left, op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.ADD, right.toAST(__filename), getLoc(op, __filename)); },
    AddExp_minus(left, op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.SUBTRACT, right.toAST(__filename), getLoc(op, __filename)); },
    AddExp(left) { return left.toAST(__filename); },
    MulExp_multiply(left, op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.MULTIPLY, right.toAST(__filename), getLoc(op, __filename)); },
    MulExp_divide(left, op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.DIVIDE, right.toAST(__filename), getLoc(op, __filename)); },
    MulExp_remainder(left, op, right) { return new ASTs.BinaryOperation(left.toAST(__filename), BinaryOperator.REMAINDER, right.toAST(__filename), getLoc(op, __filename)); },
    MulExp(left) { return left.toAST(__filename); },
    UnaryExp_preIncrement(op, right) { return new ASTs.PreUnary(UnaryOperator.INCREMENT, right.toAST(__filename), getLoc(op, __filename)); },
    UnaryExp_preDecrement(op, right) { return new ASTs.PreUnary(UnaryOperator.DECREMENT, right.toAST(__filename), getLoc(op, __filename)); },
    UnaryExp_preNot(op, right) { return new ASTs.PreUnary(UnaryOperator.LOGIC_NOT, right.toAST(__filename), getLoc(op, __filename)); },
    UnaryExp(left) { return left.toAST(__filename); },
    PostUnaryExp_postIncrement(left, op) { return new ASTs.PostUnary(UnaryOperator.INCREMENT, left.toAST(__filename), getLoc(op, __filename)); },
    PostUnaryExp_postDecrement(left, op) { return new ASTs.PostUnary(UnaryOperator.DECREMENT, left.toAST(__filename), getLoc(op, __filename)); },
    PostUnaryExp(left) { return left.toAST(__filename); },
    FunctionCall_fn(name, _open, args, _close) { return new ASTs.FunctionCall(name.sourceString, args.toAST(__filename), getLoc(name, __filename)); },
    FunctionCall(left) { return left.toAST(__filename); },
    MacroCall_macro(name, _bang, _open, args, _close) { return new ASTs.MacroCall(name.sourceString, args.toAST(__filename), getLoc(name, __filename)); },
    MacroCall(left) { return left.toAST(__filename); },
    MemberAccess_mem(expr, _dot, ident) { return new ASTs.MemberAccess(expr.toAST(__filename), ident.sourceString, getLoc(_dot, __filename)); },
    MemberAccess(left) { return left.toAST(__filename); },
    IndexAccess_index(expr, _open, index, _close) { return new ASTs.IndexAccess(expr.toAST(__filename), index.toAST(__filename), getLoc(_open, __filename)); },
    IndexAccess(left) { return left.toAST(__filename); }
};