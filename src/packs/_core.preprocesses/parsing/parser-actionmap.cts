import { ASTs } from "../../../pack-combinator.cjs";
import { Statement } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';

export const actionMap: ActionMap<Statement> = {
    Include(this: ActionMapThis, _include, path, _semi) {
        return new ASTs.Include(path.toAST(this.args.ophoelDir), getLoc(_include, this.args.ophoelDir));
    }
};
