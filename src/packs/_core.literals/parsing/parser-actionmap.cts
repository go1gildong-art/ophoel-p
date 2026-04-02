import { ASTs } from "../../../pack-combinator.cjs";
import { Expression } from "../../../ast.cjs";
import { getLoc, ActionMap } from "../../../compiler/parser.cjs";
import * as ohm from 'ohm-js';

type literalActionTypes = Expression | string | { key: string; value: any; };
export const actionMap: ActionMap<literalActionTypes> = {
    string(_openQuote, chars, _closeQuote) {
        return new ASTs.StringLiteral(
            chars.sourceString,
            getLoc(chars, __filename)
        );
    },

    TemplateString(_open, parts, _close) {
        const contents = parts.toAST(__filename);
        return new ASTs.TemplateStringLiteral(
            contents.filter((_: any, i: number) => i % 2 === 0),
            contents.filter((_: any, i: number) => i % 2 !== 0),
            parts.sourceString,
            getLoc(_open, __filename)
        );
    },

    TemplatePart_exprPart(_open, expr, _close) {
        return expr.toAST(__filename);
    },

    TemplatePart_stringPart(chars) {
        return chars.sourceString;
    },

    number(digits) {
        return new ASTs.IntLiteral(
            parseInt(digits.sourceString).toString(),
            getLoc(digits, __filename)
        );
    },

    bool(bool) {
        return new ASTs.BoolLiteral(bool.sourceString, getLoc(bool, __filename));
    },

    VectorLiteral(_open, components, _close) {
        const comps = components.toAST(__filename);
        return new ASTs.VectorLiteral(comps, getLoc(_open, __filename));
    },

    Pair(key, _colon, value) {
        return {
            key: key.sourceString,
            value: value.toAST(__filename)
        };
    },

    CompoundLiteral(_open, pairs, _close) {
        type KVAccumulator = { keys: string[]; values: Expression[] };
        type KVPair = { key: string, value: Expression };

        const kvAcc: KVAccumulator
            = pairs.toAST(__filename).reduce((acc: KVAccumulator, kvPair: KVPair) => {
                acc.keys.push(kvPair.key);
                acc.values.push(kvPair.value);
                return acc
            }
                , { keys: [], values: [] });

        return new ASTs.CompoundLiteral(kvAcc.keys, kvAcc.values, getLoc(_open, __filename));
    }
};
