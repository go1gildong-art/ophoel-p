import { Context, InterpretReturn } from "../../compiler/interpreter/utilities.cjs";
import { ASTTypes } from "../../pack-combinator.cjs";


export function Block(ast: ASTTypes["Block"], ctx: Context){
    /*
    ast.statements.forEach(s => {
        const res = s.evaluate(ctx);
        if (!res.ok) return res;
    }
*/
    
}

export function ExecExpr(ast: ASTTypes["ExecExpr"]) {

    return `(ex ${ast.expression.lispify()})`;
}

export function Program(ast: ASTTypes["Program"]) {
    const body = ast.body.map(s => s.lispify()).join(" ");
    return `(program ${body})`;
}
