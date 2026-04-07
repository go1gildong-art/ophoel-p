
export enum TestState {
    Success = "SUCCESS",
    Failure = "FAILURE",
    Uninitialized = "UNINITIALIZED",
    Error = "ERROR",
    Skip = "SKIP"
}

export class TestResult {
    readonly state: TestState;
    readonly message: any;
    readonly children: TestResult[];
    readonly link?: string;

    constructor(state: TestState, message?: any, children?: TestResult[], link?: string) {
        this.state = state;
        this.message = message ?? "";
        this.children = children ?? [];
        this.link = link;
    }

    static success(message?: any, children?: TestResult[], link?: string) {
        return new TestResult(TestState.Success, message, children, link);
    }

    static failure(message?: any, children?: TestResult[], link?: string) {
        return new TestResult(TestState.Failure, message, children, link);
    }

    static error(error: unknown, message?: any, link?: string) {
        if (error instanceof Error) {
            const msg = {
                result: "An error occurred while testing: " + error.message,
                ...(message ?? {})
            };
            return new TestResult(TestState.Error, msg, [], link);
        } else {
            const msg = "An unexpected object thrown while testing: " + error;
            return new TestResult(TestState.Error, msg, [], link);
        }
    }

    static errorVerbose(error: unknown, message?: any, link?: string) {
        if (error instanceof Error) {
            const msg = {
                error: "An error occurred while testing",
                ...(message ?? {}),
                stack: error.stack?.split("\n") ?? [],
                errorObject: error // property for inspecting inside code
            };
            return new TestResult(TestState.Error, msg, [], link);
        } else {
            const msg = "An unexpected object thrown while testing: " + error;
            return new TestResult(TestState.Error, msg, [], link);
        }
    }

    static uninitialized() {
        return new TestResult(TestState.Uninitialized);
    }

    static skip(link?: string) {
        const msg = "Skipped this test."
        return new TestResult(TestState.Skip, msg, [], link);
    }

    static hasNoFailure(children: TestResult[]) {
        return !children.some(c => [TestState.Failure, TestState.Error].includes(c.state));
    }

    static buildFromChildren(children: TestResult[], successMessage?: any, failureMessage?: any, link?: string) {
        if (TestResult.hasNoFailure(children)) {
            return TestResult.success(successMessage + " " + TestResult.getCoverageMark(children), children, link);
        } else {
            return TestResult.failure(failureMessage + " " + TestResult.getCoverageMark(children), children, link);
        }
    }

    static getCoverageMark(children: readonly TestResult[]) {
        const allchildren = children
            .filter(result => ![TestState.Skip].includes(result.state));

        const succeedchildren = children
            .filter(result => [TestState.Success].includes(result.state));

        return `( ${succeedchildren.length} / ${allchildren.length} )`
    }
}