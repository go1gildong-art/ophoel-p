
export enum TestState {
    Success = "SUCCESS",
    Failure = "FAILURE",
    Uninitialized = "UNINITIALIZED",
    Error = "ERROR",
    Skip = "SKIP"
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

    static success(message?: string, children?: TestResult[]) {
        return new TestResult(TestState.Success, message, children);
    }

    static failure(message?: string, children?: TestResult[]) {
        return new TestResult(TestState.Failure, message, children);
    }

    static error(error: unknown) {
        if (error instanceof Error) {
            const msg = "An error occurred while testing: " + error.message;
            return new TestResult(TestState.Error, msg);
        } else {
            const msg = "An unexpected object thrown while testing: " + error;
            return new TestResult(TestState.Error, msg);
        }
    }

    static uninitialized() {
        return new TestResult(TestState.Uninitialized);
    }

    static skip() {
        const msg = "Skipped this test."
        return new TestResult(TestState.Skip, msg);
    }

    static hasNoFailure(children: TestResult[]) {
        return !children.some(c => [TestState.Failure, TestState.Error].includes(c.state));
    }

    static buildFromChildren(children: TestResult[], successMessage?: string, failureMessage?: string) {
        if (TestResult.hasNoFailure(children)) {
            return TestResult.success(successMessage + " " + TestResult.getCoverageMark(children), children);
        } else {
            return TestResult.failure(failureMessage + " " + TestResult.getCoverageMark(children), children);
        }
    }

    static getCoverageMark(children: readonly TestResult[]) {
        const allchildren = children
            .filter(result => [TestState.Success, TestState.Failure].includes(result.state));

        const succeedchildren = children
            .filter(result => [TestState.Success].includes(result.state));

        return `( ${succeedchildren.length} / ${allchildren.length} )`
    }
}