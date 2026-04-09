import { Context, InterpretReturn, OphoelValue } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { BinaryOperation as BinOperationNode, BinaryOperator, UnaryOperator } from "./nodes.cjs";
import { IntLiteral } from "../_core.literals/nodes.cjs";
import * as res from "../../utils/result.cjs";

export function BinaryOperation(ast: ASTTypes["BinaryOperation"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const left = ast.left.evaluate(ctx.wrap());
    if (!left.ok) return left;

    const right = ast.right.evaluate(ctx.wrap());
    if (!right.ok) return right;

    switch (ast.operator) {
        case BinaryOperator.ADD:
            if (left.value.type === "num" && right.value.type === "num") {
                return res.makeOK({ type: "num", value: left.value.value + right.value.value }, ctx.wrap());

            } else if (left.value.type === "string" && right.value.type === "string") {
                return res.makeOK({ type: "string", value: left.value.value + right.value.value }, ctx.wrap());

            } else if (left.value.type === "vector" && right.value.type === "vector") {
                return res.makeOK({ type: "vector", value: [...left.value.value, ...right.value.value] }, ctx.wrap());

            } else {
                return res.makeErr(new Error(`operator '+' not supported for types '${left.value.type}' and '${right.value.type}'`));
            }

        case BinaryOperator.SUBTRACT:
            if (left.value.type === "num" && right.value.type === "num") {
                return res.makeOK({ type: "num", value: left.value.value - right.value.value }, ctx.wrap());

            } else {
                return res.makeErr(new Error(`operator '-' not supported for types '${left.value.type}' and '${right.value.type}'`));
            }

        case BinaryOperator.MULTIPLY:
            if (left.value.type === "num" && right.value.type === "num") {
                return res.makeOK({ type: "num", value: left.value.value * right.value.value }, ctx.wrap());

            } else {
                return res.makeErr(new Error(`operator '*' not supported for types '${left.value.type}' and '${right.value.type}'`));
            }

        case BinaryOperator.DIVIDE:
            if (left.value.type === "num" && right.value.type === "num") {
                return res.makeOK({ type: "num", value: left.value.value / right.value.value }, ctx.wrap());

            } else if (right.value.type === "num" && right.value.value === 0) {
                return res.makeErr(new Error("Division by zero!"));

            } else {
                return res.makeErr(new Error(`operator '/' not supported for types '${left.value.type}' and '${right.value.type}'`));
            }

        case BinaryOperator.REMAINDER:
            if (left.value.type === "num" && right.value.type === "num") {
                return res.makeOK({ type: "num", value: left.value.value % right.value.value }, ctx.wrap());

            } else {
                return res.makeErr(new Error(`operator '%' not supported for types '${left.value.type}' and '${right.value.type}'`));
            }
    }

    return res.makeErr({
        ok: false,
        err: new Error(`BinaryOperation: operator '${ast.operator}' not implemented yet`)
    })
}

export function PreUnary(ast: ASTTypes["PreUnary"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const operand = ast.right.evaluate(ctx.wrap());
    if (!operand.ok) return operand;

    new BinOperationNode(
        ast.right,
        BinaryOperator.ADD,
        new IntLiteral("1", ast.location),
        ast.location
    ).evaluate(ctx.wrap());


    switch (ast.operator) {
        case UnaryOperator.INCREMENT: {
            const value = new BinOperationNode(
                ast.right,
                BinaryOperator.ADD,
                new IntLiteral("1", ast.location),
                ast.location
            ).evaluate(ctx.wrap());
            if (!value.ok) return value;

            operand.value = value.value;
            return res.makeOK({ type: "num", value: operand.value.value }, ctx.wrap());
        }

        case UnaryOperator.DECREMENT: {
            const value = new BinOperationNode(
                ast.right,
                BinaryOperator.SUBTRACT,
                new IntLiteral("1", ast.location),
                ast.location
            ).evaluate(ctx.wrap());
            if (!value.ok) return value;

            operand.value = value.value;
            return res.makeOK({ type: "num", value: operand.value.value }, ctx.wrap());
        }

        case UnaryOperator.LOGIC_NOT: {
            if (operand.value.type !== "bool") {
                return res.makeErr(new Error(`operator '!' not supported for type '${operand.value.type}'`));
            }

            operand.value.value = !operand.value.value;
            return res.makeOK({ type: "num", value: operand.value.value }, ctx.wrap());
        }


    }
}

export function PostUnary(ast: ASTTypes["PostUnary"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const operand = ast.left.evaluate(ctx.wrap());
    if (!operand.ok) return operand;

    new BinOperationNode(
        ast.left,
        BinaryOperator.ADD,
        new IntLiteral("1", ast.location),
        ast.location
    ).evaluate(ctx.wrap());


    switch (ast.operator) {
        case UnaryOperator.INCREMENT: {
            const value = new BinOperationNode(
                ast.left,
                BinaryOperator.ADD,
                new IntLiteral("1", ast.location),
                ast.location
            ).evaluate(ctx.wrap());
            if (!value.ok) return value;

            const oldValue = { ...operand.value };
            operand.value = value.value;
            return res.makeOK({ type: "num", value: oldValue.value }, ctx.wrap());
        }

        case UnaryOperator.DECREMENT: {
            const value = new BinOperationNode(
                ast.left,
                BinaryOperator.SUBTRACT,
                new IntLiteral("1", ast.location),
                ast.location
            ).evaluate(ctx.wrap());
            if (!value.ok) return value;

            const oldValue = { ...operand.value };
            operand.value = value.value;
            return res.makeOK({ type: "num", value: oldValue.value }, ctx.wrap());
        }

        case UnaryOperator.LOGIC_NOT: {
            return res.makeErr(new Error(`operator '!' cannot be used as a post-unary operator`));
        }
    }
}

export function IndexAccess(ast: ASTTypes["IndexAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("IndexAccess: not implemented yet") };
}

export function MemberAccess(ast: ASTTypes["MemberAccess"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("MemberAccess: not implemented yet") };
}

export function FunctionCall(ast: ASTTypes["FunctionCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("FunctionCall: not implemented yet") };
}

export function VariableAssign(ast: ASTTypes["VariableAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("VariableAssign: not implemented yet") };
}

export function CompoundAssign(ast: ASTTypes["CompoundAssign"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("CompoundAssign: not implemented yet") };
}

export function MacroCall(ast: ASTTypes["MacroCall"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("MacroCall: not implemented yet") };
}
