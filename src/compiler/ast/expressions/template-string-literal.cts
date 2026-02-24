import { Expression } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class TemplateStringLiteral extends Expression {
    kind = "TemplateStringLiteral";

    quasis: string[];
    expressions: Expression[];

    constructor(quasis: string[], expressions: Expression[], location: Location) {
        this.quasis = quasis;
        this.expressions = expressions;
        this.location = location;
    }
}