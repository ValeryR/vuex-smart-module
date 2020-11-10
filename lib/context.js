import { __assign } from "tslib";
import { Mutations as BaseMutations, Actions as BaseActions, } from './assets';
import { get, gatherHandlerNames, assert } from './utils';
export function createLazyContextPosition(module) {
    var message = 'The module need to be registered a store before using `Module#context` or `createMapper`';
    return {
        get path() {
            assert(module.path !== undefined, message);
            return module.path;
        },
        get namespace() {
            assert(module.namespace !== undefined, message);
            return module.namespace;
        },
    };
}
function normalizedDispatch(dispatch, namespace, type, payload, options) {
    if (typeof type === 'string') {
        return dispatch(namespace + type, payload, options);
    }
    else {
        return dispatch(__assign(__assign({}, type), { type: namespace + type.type }), payload);
    }
}
export function commit(store, namespace, type, payload, options) {
    normalizedDispatch(store.commit, namespace, type, payload, options);
}
export function dispatch(store, namespace, type, payload, options) {
    return normalizedDispatch(store.dispatch, namespace, type, payload, options);
}
export function getters(store, namespace) {
    var sliceIndex = namespace.length;
    var getters = {};
    Object.keys(store.getters).forEach(function (key) {
        var sameNamespace = namespace === key.slice(0, sliceIndex);
        var name = key.slice(sliceIndex);
        if (!sameNamespace || !name) {
            return;
        }
        Object.defineProperty(getters, name, {
            get: function () { return store.getters[key]; },
            enumerable: true,
        });
    });
    return getters;
}
var Context = /** @class */ (function () {
    /** @internal */
    function Context(pos, store, moduleOptions) {
        var _this = this;
        this.pos = pos;
        this.store = store;
        this.moduleOptions = moduleOptions;
        this.commit = function (type, payload, options) {
            return commit(_this.store, _this.pos.namespace, type, payload, options);
        };
        this.dispatch = function (type, payload, options) {
            return dispatch(_this.store, _this.pos.namespace, type, payload, options);
        };
    }
    Object.defineProperty(Context.prototype, "mutations", {
        get: function () {
            var _this = this;
            if (this.__mutations__) {
                return this.__mutations__;
            }
            var mutations = {};
            var mutationsClass = this.moduleOptions.mutations;
            if (mutationsClass) {
                var mutationNames = gatherHandlerNames(mutationsClass.prototype, BaseMutations);
                mutationNames.forEach(function (name) {
                    Object.defineProperty(mutations, name, {
                        value: function (payload) { return _this.commit(name, payload); },
                        enumerable: true,
                    });
                });
            }
            return (this.__mutations__ = mutations);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "actions", {
        get: function () {
            var _this = this;
            if (this.__actions__) {
                return this.__actions__;
            }
            var actions = {};
            var actionsClass = this.moduleOptions.actions;
            if (actionsClass) {
                var actionNames = gatherHandlerNames(actionsClass.prototype, BaseActions);
                actionNames.forEach(function (name) {
                    Object.defineProperty(actions, name, {
                        value: function (payload) { return _this.dispatch(name, payload); },
                        enumerable: true,
                    });
                });
            }
            return (this.__actions__ = actions);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "state", {
        get: function () {
            return get(this.pos.path, this.store.state);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "getters", {
        get: function () {
            return getters(this.store, this.pos.namespace);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "modules", {
        get: function () {
            var _this = this;
            var modules = {};
            var children = this
                .moduleOptions.modules;
            if (!children) {
                return modules;
            }
            Object.keys(children).forEach(function (key) {
                var child = children[key];
                Object.defineProperty(modules, key, {
                    get: function () {
                        return new Context(createLazyContextPosition(child), _this.store, child.options);
                    },
                });
            });
            return modules;
        },
        enumerable: false,
        configurable: true
    });
    return Context;
}());
export { Context };
