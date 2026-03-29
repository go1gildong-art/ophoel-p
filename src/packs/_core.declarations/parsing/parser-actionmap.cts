import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
    VariableDecl(kw, name, _eq, expr, _semi) {
        return new ASTs.VariableDecl(
            name.sourceString,
            expr.toAST(__filename),
            getLoc(kw, __filename)
        );
    },

    ConstDecl(kw, name, _eq, expr, _semi) {
        return new ASTs.ConstDecl(
            name.sourceString,
            expr.toAST(__filename),
            getLoc(kw, __filename)
        );
    },
        
    FunctionDecl(_fn, name, _open, params, _close, body) {
        return new ASTs.FunctionDecl(
            name.sourceString,
            params.sourceString.split(", "),
            body.toAST(__filename),
            getLoc(_fn, __filename)
        );
    },

    MacroDecl(_macro, name, _open, params, _close, body) {
        return new ASTs.MacroDecl(
            name.sourceString,
            params.sourceString.split(", "),
            body.toAST(__filename),
            getLoc(_macro, __filename)
        );
    }
}