export type OphoelValue =
  | { type: "bool"; value: boolean }
  | { type: "num"; value: number }
  | { type: "string"; value: string }
  | { type: "vector"; value: OphoelValue[] }
  | { type: "compound"; value: Record<string, OphoelValue> };