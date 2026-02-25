import { ASTNode, Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";
import { OphoelType } from "../../types.cjs";

export class VectorLiteral implements Expression {
    location: Location;

    kind = "VectorLiteral";
    entries: ASTNode[];

    constructor(entries: ASTNode[], location: Location) {
        this.entries = entries;
        this.location = location;
    }
}