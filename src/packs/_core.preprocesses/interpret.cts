import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";

import { res } from "#utils";


export async function Include(ast: ASTTypes["Include"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: await OphoelError.fromNode("Include: not implemented yet", ast, _ctx.fm as FileManager) };
}
