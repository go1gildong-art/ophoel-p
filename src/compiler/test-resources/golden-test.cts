export interface GoldenUnit<source_T, expectation_T> {
    readonly title: string;
    readonly description: string;
    readonly source: source_T;
    readonly expectation: expectation_T;
}