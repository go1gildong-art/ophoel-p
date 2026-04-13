import { ASTs } from "../../../pack-combinator.cjs";
import { Expression } from "../../../ast.cjs";
import { BinaryOperator, UnaryOperator } from "../../../packs/_core.operations/nodes.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import { fail } from "../../../utils/fail.cjs";

export const actionMap: ActionMap<Expression> = {
    OrExp_or(this: ActionMapThis, left, _op, right) {
        return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.LOGIC_OR, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir));
    },
    OrExp(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    AndExp_and(this: ActionMapThis, left, _op, right) {
        return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.LOGIC_AND, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir));
    },
    AndExp(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    CompareExp_eq(this: ActionMapThis, left, _op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.LOGIC_IS, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir)); },
    CompareExp_neq(this: ActionMapThis, left, _op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.LOGIC_IS_NOT, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir)); },
    CompareExp_gte(this: ActionMapThis, left, _op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.CMPARE_SLARGER, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir)); },
    CompareExp_lte(this: ActionMapThis, left, _op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.CMPARE_SSMALLER, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir)); },
    CompareExp_gt(this: ActionMapThis, left, _op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.CMPARE_LARGER, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir)); },
    CompareExp_lt(this: ActionMapThis, left, _op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.CMPARE_SMALLER, right.toAST(this.args.ophoelDir), getLoc(_op, this.args.ophoelDir)); },
    CompareExp(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    AddExp_plus(this: ActionMapThis, left, op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.ADD, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    AddExp_minus(this: ActionMapThis, left, op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.SUBTRACT, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    AddExp(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    MulExp_multiply(this: ActionMapThis, left, op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.MULTIPLY, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    MulExp_divide(this: ActionMapThis, left, op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.DIVIDE, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    MulExp_remainder(this: ActionMapThis, left, op, right) { return new ASTs.BinaryOperation(left.toAST(this.args.ophoelDir), BinaryOperator.REMAINDER, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    MulExp(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    UnaryExp_preIncrement(this: ActionMapThis, op, right) { return new ASTs.PreUnary(UnaryOperator.INCREMENT, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    UnaryExp_preDecrement(this: ActionMapThis, op, right) { return new ASTs.PreUnary(UnaryOperator.DECREMENT, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    UnaryExp_preNot(this: ActionMapThis, op, right) { return new ASTs.PreUnary(UnaryOperator.LOGIC_NOT, right.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    UnaryExp(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    PostUnaryExp_postIncrement(this: ActionMapThis, left, op) { return new ASTs.PostUnary(UnaryOperator.INCREMENT, left.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    PostUnaryExp_postDecrement(this: ActionMapThis, left, op) { return new ASTs.PostUnary(UnaryOperator.DECREMENT, left.toAST(this.args.ophoelDir), getLoc(op, this.args.ophoelDir)); },
    PostUnaryExp(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    FunctionCall_fn(this: ActionMapThis, name, _open, args, _close) { return new ASTs.FunctionCall(name.sourceString, args.toAST(this.args.ophoelDir), getLoc(name, this.args.ophoelDir)); },
    FunctionCall(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    MacroCall_macro(this: ActionMapThis, name, _bang, _open, args, _close) { return new ASTs.MacroCall(name.sourceString, args.toAST(this.args.ophoelDir), getLoc(name, this.args.ophoelDir)); },
    MacroCall(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    MemberAccess_mem(this: ActionMapThis, expr, _dot, ident) { return new ASTs.MemberAccess(expr.toAST(this.args.ophoelDir), ident.sourceString, getLoc(_dot, this.args.ophoelDir)); },
    MemberAccess(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },
    IndexAccess_index(this: ActionMapThis, expr, _open, index, _close) { return new ASTs.IndexAccess(expr.toAST(this.args.ophoelDir), index.toAST(this.args.ophoelDir), getLoc(_open, this.args.ophoelDir)); },
    IndexAccess(this: ActionMapThis, left) { return left.toAST(this.args.ophoelDir); },

    VariableAssign_assign(this: ActionMapThis, address, _eq, value) {
        return new ASTs.VariableAssign(address.toAST(this.args.ophoelDir), value.toAST(this.args.ophoelDir), getLoc(_eq, this.args.ophoelDir));
    },

    CompoundAssign_assign(this: ActionMapThis, address, op, value) {
        const operatorMap: Record<string, BinaryOperator> = {
            "+=": BinaryOperator.ADD,
            "-=" : BinaryOperator.SUBTRACT,
            "*=" : BinaryOperator.MULTIPLY,
            "/=" : BinaryOperator.DIVIDE,
            "%=" : BinaryOperator.REMAINDER
        };
        return new ASTs.CompoundAssign(
            address.toAST(this.args.ophoelDir),
            operatorMap[op.sourceString] ?? fail(new Error(`Unknown compound operator: ${op.sourceString}`)),
            value.toAST(this.args.ophoelDir),
            getLoc(op, this.args.ophoelDir)
        );
    }
};