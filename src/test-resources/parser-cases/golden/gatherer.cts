import { Tester } from "../../tester.cjs";
import { loadTests } from "../../test_loader.cjs";
import { ParserGolden } from "./itnerface.cjs";

export class ParseGoldenGatherer implements Tester {

    public async test() {
        try {
            const cases = await loadTests<ParserGolden>("./units");
            cases.forEach(c => console.log(c.title));
            const results = await Promise.all(cases.map(async unitCase => new UnitTester(unitCase).test()));

            return TestResult.buildFromChildren(
                results,
                "Lexer golden test succeed!",
                "Lexer golden test failed."
            );

        } catch (error) {
            return TestResult.error(error);
        }
    }
}