import { Store, GetterTree, MutationTree, ActionTree } from 'vuex';
import { BA, BG, BM } from './assets';
import { Class } from './utils';
import { Context, Commit, Dispatch } from './context';
import { MappedFunction, RestArgs } from './mapper';
export interface ModuleOptions<S, G extends BG<S>, M extends BM<S>, A extends BA<S, G, M>, Modules extends Record<string, Module<any, any, any, any, any>> = {}> {
    namespaced?: boolean;
    state?: Class<S>;
    getters?: Class<G>;
    mutations?: Class<M>;
    actions?: Class<A>;
    modules?: Modules;
}
export declare class Module<S, G extends BG<S>, M extends BM<S>, A extends BA<S, G, M>, Modules extends Record<string, Module<any, any, any, any, any>> = {}> {
    options: ModuleOptions<S, G, M, A, Modules>;
    private mapper;
    constructor(options?: ModuleOptions<S, G, M, A, Modules>);
    clone(): Module<S, G, M, A, Modules>;
    context(store: Store<any>): Context<this>;
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
    getStoreOptions(): {
        plugins: ((store: Store<any>) => void)[];
        namespaced?: boolean | undefined;
        state?: any;
        getters?: GetterTree<any, any> | undefined;
        actions?: ActionTree<any, any> | undefined;
        mutations?: MutationTree<any> | undefined;
        modules?: import("vuex").ModuleTree<any> | undefined;
    };
}
export declare function hotUpdate(store: Store<unknown>, module: Module<any, any, any, any, any>): void;
