import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const block: ActionMap<Statement> = {
    Block(_open, statements, _close) {
        const statementList = statements.toAST(__filename);
        return new ASTs.Block(statementList, getLoc(_open, __filename));
    }
}