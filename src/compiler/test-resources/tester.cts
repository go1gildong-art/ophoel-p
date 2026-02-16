import { TestResult } from "./test-result.cjs"

export interface Tester {
    test(): TestResult
}