
export interface GoldenCase<source_T, result_T> {
    readonly title: string;
    readonly description: string;
    readonly source: source_T;
    readonly expectation: result_T;
    readonly process: (arg: source_T) => result_T
}