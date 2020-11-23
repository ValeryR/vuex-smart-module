import { assert } from './utils';
export function registerModule(store, path, namespace, module, options) {
    var normalizedPath = typeof path === 'string' ? [path] : path;
    var _a = module.create(normalizedPath, normalizeNamespace(namespace)), moduleOptions = _a.options, injectStore = _a.injectStore;
    store.registerModule(normalizedPath, moduleOptions, options);
    injectStore(store);
}
export function unregisterModule(store, module) {
    assert(module.path, 'The module seems not registered in the store');
    store.unregisterModule(module.path);
}
function normalizeNamespace(namespace) {
    if (namespace === '' || namespace === null) {
        return '';
    }
    return namespace[namespace.length - 1] === '/' ? namespace : namespace + '/';
}
