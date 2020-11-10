import { Store, ModuleOptions } from 'vuex';
import { Module } from './module';
export declare function registerModule(store: Store<any>, path: string | string[], namespace: string | null, module: Module<any, any, any, any, any>, options?: ModuleOptions): void;
export declare function unregisterModule(store: Store<any>, module: Module<any, any, any, any, any>): void;
