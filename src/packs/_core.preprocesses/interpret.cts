import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function Include(ast: ASTTypes["Include"], _ctx: Context): InterpretReturn {
    return { ok: false, err: "not implemented yet" };
}
