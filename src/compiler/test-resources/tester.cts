import { TestResult } from "./test-result.cjs"

export interface Tester {
    public test(): Promise<TestResult>;
}