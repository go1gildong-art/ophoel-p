import { ASTTypes } from "./ast/ast-collection.cjs"
import { ASTNode, StandardNode } from "./ast/ast.cjs"

import { Block } from "./packs/_core.backbone/nodes.cjs"
import * as fp from "./utils/functional.cjs";

import { pack as _core_backbone } from "./packs/_core.backbone/module.cjs"
import { pack as _core_control_flow } from "./packs/_core.control-flow/module.cjs"
import { pack as _core_declarations } from "./packs/_core.declarations/module.cjs"
import { pack as _core_expr_misc } from "./packs/_core.expr-misc/module.cjs"
import { pack as _core_literals } from "./packs/_core.literals/module.cjs"
import { pack as _core_mc } from "./packs/_core.mc/module.cjs"
import { pack as _core_operations } from "./packs/_core.operations/module.cjs"
import { pack as _core_preprocesses } from "./packs/_core.preprocesses/module.cjs"




export const packs = {
  _core_backbone,
  _core_control_flow,
  _core_declarations,
  _core_expr_misc,
  _core_literals,
  _core_mc,
  _core_operations,
  _core_preprocesses
} as const;

export const actionMaps = Object.assign(
  {},
  ...Object.values(packs).map(p => p.actionMap)
) as ActionMaps;

type ActionMaps =
  typeof _core_backbone.actionMap
  & typeof _core_control_flow.actionMap
  & typeof _core_declarations.actionMap
  & typeof _core_expr_misc.actionMap
  & typeof _core_literals.actionMap
  & typeof _core_mc.actionMap
  & typeof _core_operations.actionMap
  & typeof _core_preprocesses.actionMap


  export const grammars = Object.fromEntries(
    Object.entries(packs).map(([name, p]) => ([name, p.grammar ]))
  );





export const ASTs = Object.assign(
  {},
  ...Object.values(packs).map(p => p.nodes)
) as Nodes

type Nodes =
  typeof _core_backbone.nodes
  & typeof _core_control_flow.nodes
  & typeof _core_declarations.nodes
  & typeof _core_expr_misc.nodes
  & typeof _core_literals.nodes
  & typeof _core_mc.nodes
  & typeof _core_operations.nodes
  & typeof _core_preprocesses.nodes


/*
{
  Block: [class Block],
  ExecExpr: [class ExecExpr],
  Program: [class Program],
  ...any other node classes from any pack
}
*/