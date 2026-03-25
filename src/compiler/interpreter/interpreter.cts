type InterpretReturn = {
    ok: true;
    ctx: Context;
    value?: OphoelType;
}

class Context{}



type OphoelType =
    boolean
    | string
    | number
    | Array<OphoelType>
    | Map<string, OphoelType>
    | void