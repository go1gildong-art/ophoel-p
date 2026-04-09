import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";


export function McCommand(ast: ASTTypes["McCommand"], _ctx: Context): InterpretReturn {
    let ctx = _ctx.branch();

    const argResult = ast.argument.evaluate(_ctx);
    if (!argResult.ok) throw argResult.err;
    ctx = argResult.ctx.branch();

    const arg = argResult.value;
    
    if (arg.type !== "string"
        && arg.type !== "num"
        && arg.type !== "bool"
    ) {
        const msg = `command argument must be a string-coercible type, but got ${arg.value ?? arg} (${arg.type})`;
        console.log(arg);
        return { ok: false, err: new Error(msg) }
    }

    ctx.emitCmd(`${ast.command} ${arg.value}`, ast.location);

    return { ok: true, 
        ctx: ctx.wrap(),
        value: { type: "void", value: null }
    };
}

export function McExecStatement(ast: ASTTypes["McExecStatement"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("McExecStatement: not implemented yet") };
}
