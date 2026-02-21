export const enum OphoelTypeKinds {
    STRING,
    BOOL,
    INT_C,
    INT_S,
    FLOAT,

    VECTOR,
    
    STRUCT
}

export type OphoelValue = 
string | boolean | number |
OphoelValue[] | KVPair[];

type KVPair = {
    key: string,
    value: OphoelValue
}

export type OphoelType =
{ kind: OphoelTypeKinds.STRING }
| { kind: OphoelTypeKinds.BOOL }
| { kind: OphoelTypeKinds.INT_C }
| { kind: OphoelTypeKinds.INT_S }
| { kind: OphoelTypeKinds.FLOAT }
| { kind: OphoelTypeKinds.VECTOR, length: number, entryType: OphoelType }
| { kind: OphoelTypeKinds.STRUCT, name: string, entriesTypes: { key: string, type: OphoelType }[] };



