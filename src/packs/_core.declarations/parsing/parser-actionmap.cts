import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
            
    VariableDecl_withInit(this: ActionMapThis, kw, name, _eq, expr, _semi) {
        return new ASTs.VariableDecl(
            name.sourceString,
            expr.toAST(this.args.ophoelDir),
            getLoc(kw, this.args.ophoelDir)
        );
    },

    VariableDecl_noInit(this: ActionMapThis, kw, name, _semi) {
        return new ASTs.VariableDecl(
            name.sourceString,
            null,
            getLoc(kw, this.args.ophoelDir)
        );
    },

    ConstDecl(this: ActionMapThis, kw, name, _eq, expr, _semi) {
        return new ASTs.ConstDecl(
            name.sourceString,
            expr.toAST(this.args.ophoelDir),
            getLoc(kw, this.args.ophoelDir)
        );
    },
        
    FunctionDecl(this: ActionMapThis, _fn, name, _open, params, _close, body) {
        return new ASTs.FunctionDecl(
            name.sourceString,
            params.sourceString.split(", "),
            body.toAST(this.args.ophoelDir),
            getLoc(_fn, this.args.ophoelDir)
        );
    },

    MacroDecl(this: ActionMapThis, _macro, name, _bang, _open, paramString, _close, body) {
        const params = paramString.sourceString.split(", ");
        return new ASTs.MacroDecl(
            name.sourceString,
            params?.[0] ? params : [],
            body.toAST(this.args.ophoelDir),
            getLoc(_macro, this.args.ophoelDir)
        );
    }
}