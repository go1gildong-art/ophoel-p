import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
    Include(_include, path, _semi) {
        return new ASTs.Include(path.sourceString.slice(1, -1), getLoc(_include, __filename));
    }
};
