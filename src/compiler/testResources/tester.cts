import { TestResult } from "./testResult.cjs"

export interface Tester {
    test(): TestResult
}