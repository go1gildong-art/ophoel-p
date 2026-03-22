import { ASTs } from "../../../ast/ast-collection.cjs";
import { Statement } from "../../../ast/ast.cjs";
import { getLoc, ActionMap } from "../parser.cjs";
import * as ohm from 'ohm-js';

export const preprocesses: ActionMap<Statement> = {
    Include(_include, path, _semi) {
        return new ASTs.Include(
            path.sourceString.slice(1, -1), // Remove quotes
            getLoc(_include, __filename)
        );
    }
}