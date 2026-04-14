import { OphoelError, OphoelTSError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn, OphoelValue, moveValue } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { BinaryOperation as BinOperationNode, BinaryOperator, UnaryOperator } from "./nodes.cjs";
import { IntLiteral } from "../_core.literals/nodes.cjs";
import * as res from "../../utils/result.cjs"
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";

export async function BinaryOperation(ast: ASTTypes["BinaryOperation"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const left = await ast.left.evaluate(ctx.wrap());
        if (!left.ok) return left;
        ctx = left.ctx.branch();

        const right = await ast.right.evaluate(ctx.wrap());
        if (!right.ok) return right;
        ctx = left.ctx.branch();

        switch (ast.operator) {
            case BinaryOperator.ADD:
                if (left.value.type === "num" && right.value.type === "num") {
                    return res.makeOK({ type: "num", value: left.value.value + right.value.value }, ctx.wrap());

                } else if (left.value.type === "string" && right.value.type === "string") {
                    return res.makeOK({ type: "string", value: left.value.value + right.value.value }, ctx.wrap());

                } else if (left.value.type === "vector" && right.value.type === "vector") {
                    return res.makeOK({ type: "vector", value: [...left.value.value, ...right.value.value] }, ctx.wrap());

                } else {
                    const msg = `operator '+' not supported for types '${left.value.type}' and '${right.value.type}'`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }

            case BinaryOperator.SUBTRACT:
                if (left.value.type === "num" && right.value.type === "num") {
                    return res.makeOK({ type: "num", value: left.value.value - right.value.value }, ctx.wrap());

                } else {
                    const msg = `operator '-' not supported for types '${left.value.type}' and '${right.value.type}'`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }

            case BinaryOperator.MULTIPLY:
                if (left.value.type === "num" && right.value.type === "num") {
                    return res.makeOK({ type: "num", value: left.value.value * right.value.value }, ctx.wrap());

                } else {
                    const msg = `operator '*' not supported for types '${left.value.type}' and '${right.value.type}'`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }

            case BinaryOperator.DIVIDE:
                if (left.value.type === "num" && right.value.type === "num") {
                    return res.makeOK({ type: "num", value: left.value.value / right.value.value }, ctx.wrap());

                } else if (right.value.type === "num" && right.value.value === 0) {
                    return res.makeErr(await OphoelError.fromNode("Division by zero!", ast, _ctx.fm as FileManager));

                } else {
                    const msg = `operator '/' not supported for types '${left.value.type}' and '${right.value.type}'`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }

            case BinaryOperator.REMAINDER:
                if (left.value.type === "num" && right.value.type === "num") {
                    return res.makeOK({ type: "num", value: left.value.value % right.value.value }, ctx.wrap());

                } else {
                    const msg = `operator '%' not supported for types '${left.value.type}' and '${right.value.type}'`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }
        }

        const msg = `BinaryOperation: operator '${ast.operator}' not implemented yet`;
        return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm))
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function PreUnary(ast: ASTTypes["PreUnary"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const operand = await ast.right.evaluate(ctx.wrap());
        if (!operand.ok) return operand;

        switch (ast.operator) {
            case UnaryOperator.INCREMENT: {
                const value = await new BinOperationNode(
                    ast.right,
                    BinaryOperator.ADD,
                    new IntLiteral("1", ast.location),
                    ast.location
                ).evaluate(ctx.wrap());
                if (!value.ok) return value;

                moveValue(operand.value, value.value);
                return res.makeOK({ type: "num", value: operand.value.value }, ctx.wrap());
            }

            case UnaryOperator.DECREMENT: {
                const value = await new BinOperationNode(
                    ast.right,
                    BinaryOperator.SUBTRACT,
                    new IntLiteral("1", ast.location),
                    ast.location
                ).evaluate(ctx.wrap());
                if (!value.ok) return value;

                moveValue(operand.value, value.value);
                return res.makeOK({ type: "num", value: operand.value.value }, ctx.wrap());
            }

            case UnaryOperator.LOGIC_NOT: {
                if (operand.value.type !== "bool") {
                    const msg = `operator '!' not supported for type '${operand.value.type}'`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }

                operand.value.value = !operand.value.value;
                return res.makeOK({ type: "num", value: operand.value.value }, ctx.wrap());
            }


        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function PostUnary(ast: ASTTypes["PostUnary"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const operand = await ast.left.evaluate(ctx.wrap());
        if (!operand.ok) return operand;
        ctx = operand.ctx.branch();

        switch (ast.operator) {
            case UnaryOperator.INCREMENT: {
                const value = await new BinOperationNode(
                    ast.left,
                    BinaryOperator.ADD,
                    new IntLiteral("1", ast.location),
                    ast.location
                ).evaluate(ctx.wrap());
                if (!value.ok) return value;

                const oldValue = { ...operand.value };
                moveValue(operand.value, value.value);
                return res.makeOK({ type: "num", value: oldValue.value }, ctx.wrap());
            }

            case UnaryOperator.DECREMENT: {
                const value = await new BinOperationNode(
                    ast.left,
                    BinaryOperator.SUBTRACT,
                    new IntLiteral("1", ast.location),
                    ast.location
                ).evaluate(ctx.wrap());
                if (!value.ok) return value;

                const oldValue = { ...operand.value };
                moveValue(operand.value, value.value);
                return res.makeOK({ type: "num", value: oldValue.value }, ctx.wrap());
            }

            case UnaryOperator.LOGIC_NOT: {
                const msg = `operator '!' cannot be used as a post-unary operator`;
                return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
            }
        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function IndexAccess(ast: ASTTypes["IndexAccess"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const left = await ast.left.evaluate(ctx.wrap());
        if (!left.ok) return left;
        ctx = left.ctx.branch();

        const index = await ast.index.evaluate(ctx.wrap());
        if (!index.ok) return index;
        ctx = index.ctx.branch();


        switch (left.value.type) {
            case "vector": {
                if (index.value.type === "string" && index.value.value === "length") {
                    const address = { type: "num", value: left.value.value.length };
                    return res.makeOK(address, ctx.wrap());

                } else if (index.value.type === "num") {
                    if (index.value.value >= left.value.value.length) {
                        const msg = `Array out of bound. length: ${left.value.value.length}, got: ${index.value.type}`;
                        return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                    }
                    const address = left.value.value[index.value.value]
                    return res.makeOK(address, ctx.wrap());

                } else {
                    const msg = `Invalid index ${index.value.value}`
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }
            }

            case "compound": {
                if (index.value.type === "string") {
                    const address = left.value.value.find(address => address.field === index.value.value);
                    if (!address) {
                        const msg = `property ${index.value.value} does not exist in the compound.`;
                        return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                    }
                    return res.makeOK(address.value, ctx.wrap());
                } else {
                    const msg = `Invalid property access ${index.value.value}`
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }
            }

            default: {
                const msg = `cannot access index ${index.value.value} of type ${left.value.type}`;
                return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
            }
        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function MemberAccess(ast: ASTTypes["MemberAccess"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const left = await ast.left.evaluate(ctx.wrap());
        if (!left.ok) return left;
        ctx = left.ctx.branch();

        switch (left.value.type) {
            case "vector": {
                if (ast.member === "length") {
                    const address = { type: "num", value: left.value.value.length };
                    return res.makeOK(address, ctx.wrap());

                } else {
                    const msg = `cannot access property ${ast.member} of a vector`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }
            }

            case "compound": {
                const address = left.value.value.find(address => address.field === ast.member);
                if (!address) {
                    const msg = `property ${ast.member} does not exist in the compound.`;
                    return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
                }
                return res.makeOK(address.value, ctx.wrap());
            }

            default: {
                const msg = `cannot access property ${ast.member} of type ${left.value.type}`;
                return res.makeErr(await OphoelError.fromNode(msg, ast, ctx.fm));
            }
        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function FunctionCall(ast: ASTTypes["FunctionCall"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("FunctionCall: not implemented yet", ast, _ctx.fm as FileManager) };
}

export async function VariableAssign(ast: ASTTypes["VariableAssign"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        try {

            const address = await ast.address.evaluate(ctx.wrap());
            if (!address.ok) return address;
            ctx = address.ctx.branch();

            const setValue = await ast.setValue.evaluate(ctx.wrap());
            if (!setValue.ok) return setValue;
            ctx = setValue.ctx.branch();

            moveValue(address.value, setValue.value);

            return res.makeOK(setValue.value, ctx.wrap());
        } catch (err) {
            if (err instanceof OphoelError) {
                return res.makeErr(err);

            } else if (err instanceof Error) {
                return res.makeErr(
                    await OphoelTSError.fromNode(err.message, ast, ctx.fm)
                )

            } else {
                return res.makeErr(err);
            }
        }
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function CompoundAssign(ast: ASTTypes["CompoundAssign"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const address = await ast.address.evaluate(ctx.wrap());
        if (!address.ok) return address;
        ctx = address.ctx.branch();

        const result = await new BinOperationNode(
            ast.address,
            ast.operation,
            ast.setValue,
            ast.location
        ).evaluate(ctx.wrap());
        if (!result.ok) return result;
        ctx = result.ctx.branch();

        moveValue(address.value, result.value);

        return res.makeOK(result.value, ctx.wrap());
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}

export async function MacroCall(ast: ASTTypes["MacroCall"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("MacroCall: not implemented yet", ast, _ctx.fm as FileManager) };
}
