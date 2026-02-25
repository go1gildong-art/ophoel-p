import { Expression } from "../../ast.cjs";
import { Location } from "../../../metadata.cjs";

export class TemplateStringLiteral implements Expression {
    kind = "TemplateStringLiteral";
    location: Location;

    quasis: string[];
    expressions: Expression[];

    constructor(quasis: string[], expressions: Expression[], location: Location) {
        this.quasis = quasis;
        this.expressions = expressions;
        this.location = location;
    }
}