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