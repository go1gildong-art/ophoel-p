import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";

export function BoolLiteral(ast: ASTTypes["BoolLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("BoolLiteral: not implemented yet") };
}

export function CompoundLiteral(ast: ASTTypes["CompoundLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("CompoundLiteral: not implemented yet") };
}

export function FloatLiteral(ast: ASTTypes["FloatLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("FloatLiteral: not implemented yet") };
}

export function IntLiteral(ast: ASTTypes["IntLiteral"], _ctx: Context): InterpretReturn {
    const numValue = parseInt(ast.raw);
    
    if (isNaN(numValue)) {
        return { ok: false, err: new Error(`IntLiteral: unable to parse '${ast.raw}' as an integer`) };
    }

    return { ok: true,
        ctx: _ctx,
        value: { type: "num", value: numValue }
    };
}

export function StringLiteral(ast: ASTTypes["StringLiteral"], _ctx: Context): InterpretReturn {
    return { ok: true,
        ctx: _ctx,
        value: { type: "string", value: ast.raw }
    };
}

export function TemplateStringLiteral(ast: ASTTypes["TemplateStringLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("TemplateStringLiteral: not implemented yet") };
}

export function VectorLiteral(ast: ASTTypes["VectorLiteral"], _ctx: Context): InterpretReturn {
    return { ok: false, err: new Error("VectorLiteral: not implemented yet") };
}
