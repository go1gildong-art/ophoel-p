import { ASTs } from "../../../pack-combinator.cjs";
import { Expression } from "../../../ast.cjs";
import { getLoc, ActionMap, ActionMapThis } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';
import * as fp from '../../../utils/functional.cjs'

type literalActionTypes = Expression | string | { key: string; value: any; } | { inter: any, qua: string };
export const actionMap: ActionMap<literalActionTypes> = {
    string(this: ActionMapThis, _openQuote, chars, _closeQuote) {
        return new ASTs.StringLiteral(
            chars.sourceString,
            getLoc(chars, this.args.ophoelDir)
        );
    },

    TemplateString(this: ActionMapThis, _open, openQuasi, interQuasis, _close) {
        const contents = interQuasis.toAST(this.args.ophoelDir);

        const inters = contents.map((c: any) => c.inter);
        const quasis = [ openQuasi.toAST(this.args.ophoelDir), ...contents.map((c: any) => c.qua) ];

        return new ASTs.TemplateStringLiteral(
            quasis,
            inters,
            [openQuasi, interQuasis].map(n => n.sourceString).join(""),
            getLoc(_open, this.args.ophoelDir)
        );
    },

    InterQuasi(this: ActionMapThis, interpol, quasi) {
        return {
            inter: interpol.toAST(this.args.ophoelDir),
            //@ts-ignore
            qua: this.sourceString.slice(interpol.sourceString.length)
        }
    },

    Interpol(this: ActionMapThis, _open, expr, _close) {
        return expr.toAST(this.args.ophoelDir);
    },

    quasi(this: ActionMapThis, chars) {
        return chars.sourceString;
    },

    number(this: ActionMapThis, digits) {
        return new ASTs.IntLiteral(
            parseInt(digits.sourceString).toString(),
            getLoc(digits, this.args.ophoelDir)
        );
    },

    bool(this: ActionMapThis, bool) {
        return new ASTs.BoolLiteral(bool.sourceString, getLoc(bool, this.args.ophoelDir));
    },

    VectorLiteral(this: ActionMapThis, _open, components, _close) {
        const comps = components.toAST(this.args.ophoelDir);
        return new ASTs.VectorLiteral(comps, getLoc(_open, this.args.ophoelDir));
    },

    Pair(this: ActionMapThis, key, _colon, value) {
        return {
            key: key.sourceString,
            value: value.toAST(this.args.ophoelDir)
        };
    },

    CompoundLiteral(this: ActionMapThis, _open, pairs, _close) {
        type KVAccumulator = { keys: string[]; values: Expression[] };
        type KVPair = { key: string, value: Expression };

        const kvAcc: KVAccumulator
            = pairs.toAST(this.args.ophoelDir).reduce((acc: KVAccumulator, kvPair: KVPair) => {
                acc.keys.push(kvPair.key);
                acc.values.push(kvPair.value);
                return acc
            }
                , { keys: [], values: [] });

        return new ASTs.CompoundLiteral(kvAcc.keys, kvAcc.values, getLoc(_open, this.args.ophoelDir));
    }
};
