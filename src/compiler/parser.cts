import * as ohm from 'ohm-js';
import * as path from 'path';
import * as fs from 'fs';
import { Location, Source } from '../location.cjs'; // Your existing class
import * as p from "../pack-combinator.cjs";


const grammarFull = [
  "Ophoel {",
  ...Object.values(p.grammars),
  "}"
].join("\n");
// console.log(grammarFull);

const myGrammar = ohm.grammar(grammarFull);

export type ActionMap<T = unknown> = { [key: string]: (this: ActionMapThis, ...args: ohm.Node[]) => T };
export type ActionMapThis = { args: { ophoelDir: string } };

// 2. Helper to create your Location object from an Ohm node
export function getLoc(node: ohm.Node, ophoelDir: string): Location {
  const { lineNum, colNum } = node.source.getLineAndColumn();
  // node.source.start is the character offset
  return new Location(ophoelDir, lineNum, colNum, node.source.startIdx);
}

const semantics = myGrammar.createSemantics().addOperation('toAST(ophoelDir)', p.actionMaps as any);


export function parse({ src, ophoelDir }: Source): p.ASTTypes["Program"] {
  const match = myGrammar.match(src, "Program");
  if (match.failed()) {
    // Ohm provides a detailed error string with line/col automatically
    throw new Error(match.message);
  }
  return semantics(match).toAST(ophoelDir);
}