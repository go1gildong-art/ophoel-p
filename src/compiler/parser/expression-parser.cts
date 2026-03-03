import { Location } from "../metadata.cjs";
import { Block } from "../ast/block.cjs";
import { Program } from "../ast/program.cjs";
import { Parser } from "./parser.cjs";
import { ASTCollection } from "../ast/build-ast.cjs";



type ParserOption = {};

export class ExpressionParser extends Parser<ParserOption> {

    parse() {
        return new ASTCollection.BoolLiteral("true", new Location("e", 1, 1, 1));
    }

    boolLiteral() { }
    intLiteral() { }
    floatLiteral() { }
    stringLiteral() { }
    templateStringLiteral() { }
    vectorLiteral() { }
    compoundLiteral() { }

    unary() { }
    binary() { }
    indexAccess() { }
    memberAccess() { }

    identifier() { }

    fnCall() { }
    macroCall() { }
}
