import { getLoc, ActionMap } from "./parser.cjs";
import * as ohm from 'ohm-js';

export const utilities: ActionMap<any> = {
    // Built-in Ohm iteration handler (for the * in Statement*)
    _iter(...children) {
        return children.map(c => c.toAST(__filename));
    },

    ListOf(list) {
        return list.toAST(__filename);
    },
    NonemptyListOf(first, _sep, rest) {
        // 'first' is one node, 'rest' is an IterationNode of the remaining nodes
        return [first.toAST(__filename), ...rest.toAST(__filename)];
    },
    EmptyListOf() {
        return [];
    },

    _terminal() {
        return this.sourceString;
    }
}