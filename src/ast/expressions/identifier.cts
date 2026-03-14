import { Expression } from "../ast.cjs";
import { Location } from "../../compiler/metadata.cjs";

export class Identifier implements Expression {
    kind = "Identifier";

    constructor(
        public name: string, 
        public location: Location) {}
}
