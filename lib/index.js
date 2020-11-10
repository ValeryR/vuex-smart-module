import { __assign } from "tslib";
import { Store } from 'vuex';
import { Module } from './module';
export { Getters, Mutations, Actions, inject } from './assets';
export { Context } from './context';
export { registerModule, unregisterModule } from './register';
export { createMapper } from './mapper';
export { hotUpdate } from './module';
export { Module };
export function createStore(rootModule, options) {
    if (options === void 0) { options = {}; }
    var _a = rootModule.create([], ''), rootModuleOptions = _a.options, injectStore = _a.injectStore;
    var store = new Store(__assign(__assign(__assign({}, rootModuleOptions), options), { modules: __assign(__assign({}, rootModuleOptions.modules), options.modules), plugins: [injectStore].concat(options.plugins || []) }));
    return store;
}
