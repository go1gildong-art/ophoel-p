"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestResult = exports.TestState = void 0;
var TestState;
(function (TestState) {
    TestState["Success"] = "SUCCESS";
    TestState["Failure"] = "FAILURE";
    TestState["Uninitialized"] = "UNINITIALIZED";
    TestState["Error"] = "ERROR";
})(TestState || (exports.TestState = TestState = {}));
class TestResult {
    constructor(state, message, children) {
        this.state = state;
        this.message = message !== null && message !== void 0 ? message : "";
        this.children = children !== null && children !== void 0 ? children : [];
    }
    static success(message, children) {
        return new TestResult(TestState.Success, message, children);
    }
    static failure(message, children) {
        return new TestResult(TestState.Failure, message, children);
    }
    static error(error) {
        if (error instanceof Error) {
            const msg = "An error occurred while testing: " + error.message;
            return new TestResult(TestState.Error, msg);
        }
        else {
            const msg = "An unexpected object thrown while testing: " + error;
            return new TestResult(TestState.Error, msg);
        }
    }
    static uninitialized() {
        return new TestResult(TestState.Uninitialized);
    }
    static hasNoFailure(children) {
        return !children.some(c => [TestState.Failure, TestState.Error].includes(c.state));
    }
    static buildFromChildren(children, successMessage, failureMessage) {
        if (TestResult.hasNoFailure(children)) {
            return TestResult.success(successMessage + " " + TestResult.getCoverageMark(children), children);
        }
        else {
            return TestResult.failure(failureMessage + " " + TestResult.getCoverageMark(children), children);
        }
    }
    static getCoverageMark(children) {
        const allchildren = children
            .filter(result => [TestState.Success, TestState.Failure].includes(result.state));
        const succeedchildren = children
            .filter(result => [TestState.Success].includes(result.state));
        return `( ${succeedchildren.length} / ${allchildren.length} )`;
    }
}
exports.TestResult = TestResult;
//# sourceMappingURL=test-result.cjs.map