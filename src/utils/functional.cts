// pipe function

type AsyncFn<I, O> = (input: I) => Promise<O> | O;

// overloads. can consume up to 6 pipelines
export function pipe<A, B>(
    ab: AsyncFn<A, B>
): (a: A) => Promise<B>;

export function pipe<A, B, C>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>
): (a: A) => Promise<C>;

export function pipe<A, B, C, D>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>
): (a: A) => Promise<D>;

export function pipe<A, B, C, D, E>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>
): (a: A) => Promise<E>;

export function pipe<A, B, C, D, E, F>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>,
    ef: AsyncFn<E, F>
): (a: A) => Promise<F>;

export function pipe(...fns: Function[]) {
    return async (...input: unknown[]) => {
        let current = input;
        for (const fn of fns) {
            current = await fn(current);
        }
        return current;
    }
}


export function pipeVerbose<A, B>(
    ab: AsyncFn<A, B>
): (a: A) => Promise<B>;

export function pipeVerbose<A, B, C>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>
): (a: A) => Promise<C>;

export function pipeVerbose<A, B, C, D>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>
): (a: A) => Promise<D>;

export function pipeVerbose<A, B, C, D, E>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>
): (a: A) => Promise<E>;

export function pipeVerbose<A, B, C, D, E, F>(
    ab: AsyncFn<A, B>,
    bc: AsyncFn<B, C>,
    cd: AsyncFn<C, D>,
    de: AsyncFn<D, E>,
    ef: AsyncFn<E, F>
): (a: A) => Promise<F>;

export function pipeVerbose(...fns: Function[]) {
    return async (...input: unknown[]) => {
        let current = input;
        for (const fn of fns) {
            console.log(current);
            current = await fn(current);
        }
        return current;
    }
}



export function print<T>(x: T) {
    console.log(x);
    return x;
}


/*
type source = string;

-> throw

type AST = any;
-> (throw) type strAST = string;

-> throw
-> async

type IR = any;
-> (throw) type strIR = string;

-> throw

type out = string;
*/