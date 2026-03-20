import { ParserUnit } from "../unit.cjs";

export const unit = new ParserUnit({
    title: "Arithmetic Operators",
    description: "All arithmetic ops + - * / % should parse with precedence.",
    fileName: "test-arithmetic.cts",

    source: `const a = 1 + 2 - 3 * 4 / 5 % 6;`,
    expectation: `(program (const a (- (+ 1 2) (% (/ (* 3 4) 5) 6))))`
});