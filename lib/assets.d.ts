import { Store } from 'vuex';
import { Commit, Dispatch } from './context';
import { MappedFunction } from './mapper';
interface Class<T> {
    new (...args: any[]): T;
}
declare type DeepPartial<T> = T extends Function ? T : T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
export declare function inject<G extends Getters<S>, S>(Getters: Class<G>, injection: DeepPartial<G & {
    state: S;
    getters: G;
}>): G;
export declare function inject<M extends Mutations<S>, S>(Mutations: Class<M>, injection: DeepPartial<M & {
    state: S;
}>): M;
export declare function inject<A extends Actions<S, G, M, A>, S, G extends BG<S>, M extends BM<S>>(Actions: Class<A>, injection: DeepPartial<A & {
    state: S;
    getters: G;
    dispatch: any;
    commit: any;
    mutations: M;
    actions: A;
}>): A;
export declare class Getters<S = {}> {
    $init(_store: Store<any>): void;
    protected get state(): S;
    protected get getters(): this;
}
export declare class Mutations<S = {}> {
    protected get state(): S;
}
export declare class Actions<S = {}, G extends BG<S> = BG<S>, M extends BM<S> = BM<S>, A = {}> {
    $init(_store: Store<any>): void;
    protected get state(): S;
    protected get getters(): G;
    protected get commit(): Commit<M>;
    protected get dispatch(): Dispatch<A>;
    /**
     * IMPORTANT: Each action type maybe incorrect - return type of all actions should be `Promise<any>`
     * but the ones under `actions` are same as what you declared in this actions class.
     * The reason why we declare the type in such way is to avoid recursive type error.
     * See: https://github.com/ktsn/vuex-smart-module/issues/30
     */
    protected get actions(): A;
    protected get mutations(): Committer<M>;
}
export declare type Committer<M> = {
    [K in keyof M]: Payload<M[K]> extends never ? never : MappedFunction<M[K], void>;
};
export declare type Dispatcher<A> = {
    [K in keyof A]: Payload<A[K]> extends never ? never : MappedFunction<A[K], Promise<any>>;
};
export declare type BG<S> = Getters<S>;
export declare type BM<S> = Mutations<S>;
export declare type BA<S, G extends BG<S>, M extends BM<S>> = Actions<S, G, M>;
export declare type Payload<T> = T extends (payload?: infer P) => any ? P | undefined : T extends (payload: infer P) => any ? P : never;
export {};
