import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export async function Include(ast: ASTTypes["Include"], _ctx: Context): Promise<InterpretReturn> {
    return { ok: false, err: new Error("Include: not implemented yet") };
}
