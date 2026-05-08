import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { coerce } from "../../compiler/interpreter/coercions.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import * as res from "../../utils/result.cjs"
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";


export async function SLComment(ast: ASTTypes["SLComment"], ctx: Context): Promise<InterpretReturn> {
    return res.makeOK({type: "void", value: null}, ctx);
}

export async function MLComment(ast: ASTTypes["MLComment"], ctx: Context): Promise<InterpretReturn> {
    return res.makeOK({type: "void", value: null}, ctx);
}

export async function PreservedComment(ast: ASTTypes["PreservedComment"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        ctx.emitComment(ast.content, ast.location);
        return res.makeOK({type: "void", value: null}, ctx);
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
    
}

export async function PreservedNewline(ast: ASTTypes["PreservedNewline"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {
        ctx.emitComment("\n", ast.location);
        return res.makeOK({type: "void", value: null}, ctx);
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}