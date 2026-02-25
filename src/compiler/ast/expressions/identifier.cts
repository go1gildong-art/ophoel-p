import { LValue } from "../ast.cjs";
import { Location } from "../../metadata.cjs";

export class BinaryOperation implements LValue {
    kind = "BinaryOperation";

    constructor(
        public name: string, 
        public location: Location) {}
}
