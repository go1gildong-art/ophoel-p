export const enum OphoelTypes {
    STRING,
    BOOL,
    INT_C,
    INT_S,
    INT,
    FLOAT,
    VECTOR,
    STRUCT,
    NULL
}

export type OphoelValue = 
string | boolean | number |
OphoelValue[] | KVPair[];

type KVPair = {
    key: string,
    value: OphoelValue
}

export type OphoelType =
{ kind: OphoelTypes.STRING }
| { kind: OphoelTypes.BOOL }
| { kind: OphoelTypes.INT_C }
| { kind: OphoelTypes.INT_S }
| { kind: OphoelTypes.FLOAT }
| { kind: OphoelTypes.VECTOR, length: number, entryType: OphoelType }
| { kind: OphoelTypes.STRUCT, name: string, entryTypes: { key: string, type: OphoelType }[] };



