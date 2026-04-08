export function makeOK<T, C, R>(value: T, context: C): R {
    return { ok: true, ctx: context, value } as R;
}

export function makeErr<E, R>(err: E): R {
    return { ok: false, err } as R;
}