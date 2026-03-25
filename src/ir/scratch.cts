import { IRs } from "./ir-collection.cjs";
import { IRInstructions } from "./ir.cjs";

let foo = new IRInstructions([
    new IRs.Command("give @p diamond"),
    new IRs.Command("give @p emerald"),
    new IRs.Command("give @p redstone"),
    new IRs.Comment("this gives the nearest player diamond, emerald, and redstone")
]);

console.log(foo.toString());