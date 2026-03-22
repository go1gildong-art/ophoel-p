import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const functionDeclarations: ActionMap<Statement> = {
    FunctionDecl(_fn, name, _open, params, _close, body) {
        const paramList = params.toAST(__filename);
        return new ASTs.FunctionDecl(
            name.sourceString,
            paramList,
            body.toAST(__filename),
            getLoc(_fn, __filename)
        );
    },

    MacroDecl(_macro, name, _open, params, _close, body) {
        const paramList = params.toAST(__filename);
        return new ASTs.MacroDecl(
            name.sourceString,
            paramList,
            body.toAST(__filename),
            getLoc(_macro, __filename)
        );
    }
}