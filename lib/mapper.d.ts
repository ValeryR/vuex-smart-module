import { ContextPosition, Commit, Dispatch } from './context';
import { Module } from './module';
import { BG, BM, BA, Payload } from './assets';
export declare type MappedFunction<Fn, R> = undefined extends Payload<Fn> ? (payload?: Payload<Fn>) => R : (payload: Payload<Fn>) => R;
export declare type RestArgs<Fn> = Fn extends (_: any, ...args: infer R) => any ? R : never;
export declare function createMapper<S, G extends BG<S>, M extends BM<S>, A extends BA<S, G, M>>(module: Module<S, G, M, A, any>): ComponentMapper<S, G, M, A>;
export declare class ComponentMapper<S, G extends BG<S>, M extends BM<S>, A extends BA<S, G, M>> {
    private pos;
    constructor(pos: ContextPosition);
    mapState<K extends keyof S>(map: K[]): {
        [Key in K]: () => S[Key];
    };
    mapState<T extends Record<string, keyof S>>(map: T): {
        [Key in keyof T]: () => S[T[Key] & keyof S];
    };
    mapState<T extends Record<string, (state: S, getters: G) => any>>(map: T): {
        [Key in keyof T]: () => ReturnType<T[Key]>;
    };
    mapGetters<K extends keyof G>(map: K[]): {
        [Key in K]: () => G[Key];
    };
    mapGetters<T extends Record<string, keyof G>>(map: T): {
        [Key in keyof T]: () => G[T[Key] & keyof G];
    };
    mapMutations<K extends keyof M>(map: K[]): {
        [Key in K]: MappedFunction<M[Key], void>;
    };
    mapMutations<T extends Record<string, keyof M>>(map: T): {
        [Key in keyof T]: MappedFunction<M[T[Key] & keyof M], void>;
    };
    mapMutations<T extends Record<string, (commit: Commit<M>, ...args: any[]) => any>>(map: T): {
        [Key in keyof T]: (...args: RestArgs<T[Key]>) => ReturnType<T[Key]>;
    };
    mapActions<K extends keyof A>(map: K[]): {
        [Key in K]: MappedFunction<A[Key], Promise<any>>;
    };
    mapActions<T extends Record<string, keyof A>>(map: T): {
        [Key in keyof T]: MappedFunction<A[T[Key] & keyof A], Promise<any>>;
    };
    mapActions<T extends Record<string, (dispatch: Dispatch<A>, ...args: any[]) => any>>(map: T): {
        [Key in keyof T]: (...args: RestArgs<T[Key]>) => ReturnType<T[Key]>;
    };
}
