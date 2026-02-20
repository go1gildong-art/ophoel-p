
export enum TestState {
    Success = "SUCCESS",
    Failure = "FAILURE",
    Uninitialized = "UNINITIALIZED"
}

export class TestResult {
    readonly state: TestState;
    readonly message: string;
    readonly children: TestResult[];

    constructor(state: TestState, message?: string, children?: TestResult[]) {
        this.state = state;
        this.message = message ?? "";
        this.children = children ?? [];
    }

    static success(message?: string, children?: readonly TestResult[]) {
        return new TestResult(TestState.Success, message, children);
    }

    static failure(message?: string, children?: readonly TestResult[]) {
        return new TestResult(TestState.Failure, message, children);
    }

    static uninitialized() {
        return new TestResult(TestState.Uninitialized
        );
    }

    static hasNoFailure(results: TestResult[]) {
        return !results.some(r => r.state === TestState.Failure);
    }

    static buildFromChildren(results: readonly TestResult[], successMessage?: string, failureMessage?: string) {
        if (TestResult.hasNoFailure(results)) {
            return TestResult.success(successMessage + " " + TestResult.getCoverageMark(results), results);
        } else {
            return TestResult.failure(failureMessage + " " + TestResult.getCoverageMark(results), results);
        }
    }

    static getCoverageMark(results: readonly TestResult[]) {
        const allResults = results
            .filter(result => [TestState.Success, TestState.Failure].includes(result.state));

        const succeedResults = results
            .filter(result => [TestState.Success].includes(result.state));

        return `( ${succeedResults.length} / ${allResults.length} )`
    }
}