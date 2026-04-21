import { OphoelError } from "../../compiler/interpreter/error.cjs";
import { FileManager } from "../../compiler/file-manager.cjs";
import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";
import { makeOphoelError } from "../../compiler/interpreter/error.cjs";

import * as res  from "@utils/result.cjs";


export async function Include(ast: ASTTypes["Include"], _ctx: Context): Promise<InterpretReturn> {
    let ctx = _ctx.branch();
    try {

        const pathValue = await ast.path.evaluate(ctx.wrap());
        if (!pathValue.ok) return pathValue;
        ctx = pathValue.ctx.branch();

        if (pathValue.value.type !== "string") {
            const msg = `path must be a string, but got ${pathValue.value.value} (${pathValue.value.type})`;
            throw new Error(msg);
        }

        const includedCtx = await ctx.include(pathValue.value.value);
        return includedCtx;
        
    } catch (err) { return await makeOphoelError(err, ast, ctx.fm); }
}
