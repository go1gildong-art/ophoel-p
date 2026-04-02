import * as ohm from 'ohm-js';
import * as path from 'path';
import * as fs from 'fs';
import { Location } from '../metadata.cjs'; // Your existing class
import { ASTs, ASTTypes } from '../ast/ast-collection.cjs'; // Your nodes
import * as p from "../pack-combinator.cjs";


const grammarFull = [
  "Ophoel {",
    ...Object.values(p.grammars),
  "}"
].join("\n");
// console.log(grammarFull);

const myGrammar = ohm.grammar(grammarFull);

export type ActionMap<T = unknown> = { [key: string]: (...args: ohm.Node[]) => T };

// 2. Helper to create your Location object from an Ohm node
export function getLoc(node: ohm.Node, fileName: string): Location {
    const { lineNum, colNum } = node.source.getLineAndColumn();
    // node.source.start is the character offset
    return new Location(fileName, lineNum, colNum, node.source.startIdx);
}

const semantics = myGrammar.createSemantics().addOperation('toAST(fileName)', p.actionMaps);
export function parse({ source, __filename }: { source: string; __filename: string }): ASTTypes["Program"] {
    const match = myGrammar.match(source, "Program");
    if (match.failed()) {
        // Ohm provides a detailed error string with line/col automatically
        throw new Error(match.message);
    }
    return semantics(match).toAST(__filename);
}