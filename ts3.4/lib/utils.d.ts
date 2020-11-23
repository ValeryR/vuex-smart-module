export interface Class<T> {
    new (...args: any[]): T;
}
export declare const noop: () => void;
export declare function combine<T>(...fs: ((x: T) => void)[]): (x: T) => void;
export declare function get<T = any>(path: string[], value: any): T;
export declare function mapValues<T, R>(record: Record<string, T>, fn: (value: T, key: string) => R): Record<string, R>;
export declare function error(message: string): void;
export declare function assert(condition: any, message: string): void;
export declare function deprecated(message: string): void;
export declare function traverseDescriptors(proto: Object, Base: Function, fn: (desc: PropertyDescriptor, key: string) => void, exclude?: Record<string, boolean>): void;
export declare function gatherHandlerNames(proto: Object, Base: Function): string[];
