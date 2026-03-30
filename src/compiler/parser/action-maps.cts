import { operations } from '../../packs/_core.operations/parsing/parser-actionmap.cjs';
import { identifier } from './expressions/identifier.cjs';
import { literals } from '../../packs/_core.literals/parsing/parser-actionmap.cjs';
import { execExpr } from './statements/exec-expr.cjs';
import { declarations } from './statements/declarations.cjs';
import { functionDeclarations } from './statements/function-declarations.cjs';
import { controlFlow } from '../../packs/_core.control-flow/parsing/parser-actionmap.cjs';
import { preprocesses } from '../../packs/_core.preprocesses/parsing/parser-actionmap.cjs';
import { backbone } from '../../packs/_core.backbone/parsing/parser-actionmap.cjs';
import { mcCommand, mcExec } from '../../packs/_core.mc/parsing/parser-actionmap.cjs';
import { paren } from './expressions/paren.cjs';

export const actionMaps = {
    operations,
    paren,
    identifier,
    literals,
    execExpr,
    declarations,
    functionDeclarations,
    controlFlow,
    preprocesses,
    backbone,
    mcCommand,
    mcExec
};