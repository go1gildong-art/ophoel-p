import { ASTNode, Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class VectorLiteral extends Expression {
    kind = "VectorLiteral";
    entries: ASTNode[];

    constructor(entries: ASTNode[], location: Location) {
        this.entries = entries;
        this.location = location;
    }
}