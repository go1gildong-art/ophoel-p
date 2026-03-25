import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
    Program(statements, _end) {
        const statementList = statements.toAST(__filename);
        return new ASTs.Program(statementList, getLoc(statements, __filename));
    },
    Block(_open, statements, _close) {
        const statementList = statements.toAST(__filename);
        return new ASTs.Block(statementList, getLoc(_open, __filename));
    },
    ReturnStatement(_return, expr, _semi) {
        const value = expr?.toAST(__filename)[0];
        return new ASTs.ReturnStatement(value, getLoc(_return, __filename));
    }
};