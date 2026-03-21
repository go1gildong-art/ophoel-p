import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const program: ActionMap<Statement> = {
    Program(statements, _end) {
        const statementList = statements.toAST(__filename);

        return new ASTs.Program(
            statementList,
            getLoc(statements, __filename)
        );
    }
}