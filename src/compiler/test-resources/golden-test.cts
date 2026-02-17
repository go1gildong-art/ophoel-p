export interface GoldenUnit<source_T, expectation_T> {
    title: string;
    description: string;
    source: source_T;
    expectation: expectation_T;
}