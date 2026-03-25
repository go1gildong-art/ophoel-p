import { actionMap as operations } from '../../packs/_core.operations/parsing/parser-actionmap.cjs';
import { actionMap as exprMisc } from '../../packs/_core.expr-misc/parsing/parser-actionmap.cjs';
import { actionMap as literals } from '../../packs/_core.literals/parsing/parser-actionmap.cjs';
// import { execExpr } from './statements/exec-expr.cjs';
import { declarations } from './statements/declarations.cjs';
import { functionDeclarations } from './statements/function-declarations.cjs';
import { actionMap as controlFlow } from '../../packs/_core.control-flow/parsing/parser-actionmap.cjs';
import { actionMap as preprocesses } from '../../packs/_core.preprocesses/parsing/parser-actionmap.cjs';
import { actionMap as backbone } from '../../packs/_core.backbone/parsing/parser-actionmap.cjs';
import { mcCommand, mcExec } from '../../packs/_core.mc/parsing/parser-actionmap.cjs';

export const actionMaps = {
    operations,
    exprMisc,
    literals,
    // execExpr,
    declarations,
    functionDeclarations,
    controlFlow,
    preprocesses,
    backbone,
    mcCommand,
    mcExec
};