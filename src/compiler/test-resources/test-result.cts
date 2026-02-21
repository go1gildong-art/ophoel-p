
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

    static success(message?: string, children?: TestResult[]) {
        return new TestResult(TestState.Success, message, children);
    }

    static failure(message?: string, children?: TestResult[]) {
        return new TestResult(TestState.Failure, message, children);
    }

    static uninitialized() {
        return new TestResult(TestState.Uninitialized);
    }

    static hasNoFailure(children: TestResult[]) {
        return !children.some(c => c.state === TestState.Failure);
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