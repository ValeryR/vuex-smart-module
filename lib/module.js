import { __assign } from "tslib";
import { Getters as BaseGetters, Mutations as BaseMutations, Actions as BaseActions, } from './assets';
import { assert, mapValues, noop, combine, traverseDescriptors, error, deprecated, } from './utils';
import { Context, createLazyContextPosition } from './context';
import { ComponentMapper } from './mapper';
var Module = /** @class */ (function () {
    function Module(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.mapper = new ComponentMapper(createLazyContextPosition(this));
    }
    Module.prototype.clone = function () {
        var options = __assign({}, this.options);
        if (options.modules) {
            options.modules = mapValues(options.modules, function (m) { return m.clone(); });
        }
        return new Module(options);
    };
    Module.prototype.context = function (store) {
        return new Context(createLazyContextPosition(this), store, this.options);
    };
    Module.prototype.mapState = function (map) {
        deprecated('`Module#mapState` is deprecated. Use `createMapper` instead.');
        return this.mapper.mapState(map);
    };
    Module.prototype.mapGetters = function (map) {
        deprecated('`Module#mapGetters` is deprecated. Use `createMapper` instead.');
        return this.mapper.mapGetters(map);
    };
    Module.prototype.mapMutations = function (map) {
        deprecated('`Module#mapMutations` is deprecated. Use `createMapper` instead.');
        return this.mapper.mapMutations(map);
    };
    Module.prototype.mapActions = function (map) {
        deprecated('`Module#mapActions` is deprecated. Use `createMapper` instead.');
        return this.mapper.mapActions(map);
    };
    Module.prototype.getStoreOptions = function () {
        var injectStoreActionName = 'vuex-smart-module/injectStore';
        var _a = this.create([], ''), options = _a.options, injectStore = _a.injectStore;
        if (!options.actions) {
            options.actions = {};
        }
        options.actions[injectStoreActionName] = function () {
            injectStore(this);
        };
        var plugin = function (store) {
            store.dispatch(injectStoreActionName);
            var originalHotUpdate = store.hotUpdate;
            store.hotUpdate = function (options) {
                originalHotUpdate.call(store, options);
                store.dispatch(injectStoreActionName);
            };
        };
        return __assign(__assign({}, options), { plugins: [plugin] });
    };
    /* @internal */
    Module.prototype.create = function (path, namespace) {
        assert(!this.path || this.path.join('.') === path.join('.'), 'You are reusing one module on multiple places in the same store.\n' +
            'Clone it by `module.clone()` method to make sure every module in the store is unique.');
        this.path = path;
        this.namespace = namespace;
        var _a = this.options, _b = _a.namespaced, namespaced = _b === void 0 ? true : _b, state = _a.state, getters = _a.getters, mutations = _a.mutations, actions = _a.actions, modules = _a.modules;
        var children = !modules
            ? undefined
            : Object.keys(modules).reduce(function (acc, key) {
                var _a;
                var m = modules[key];
                var nextNamespaced = (_a = m.options.namespaced) !== null && _a !== void 0 ? _a : true;
                var nextNamespaceKey = nextNamespaced ? key + '/' : '';
                var res = m.create(path.concat(key), namespaced ? namespace + nextNamespaceKey : nextNamespaceKey);
                acc.options[key] = res.options;
                acc.injectStore = combine(acc.injectStore, res.injectStore);
                return acc;
            }, {
                options: {},
                injectStore: noop,
            });
        var gettersInstance = getters && initGetters(getters, this);
        var mutationsInstance = mutations && initMutations(mutations, this);
        var actionsInstance = actions && initActions(actions, this);
        return {
            options: {
                namespaced: namespaced,
                state: function () { return (state ? new state() : {}); },
                getters: gettersInstance && gettersInstance.getters,
                mutations: mutationsInstance && mutationsInstance.mutations,
                actions: actionsInstance && actionsInstance.actions,
                modules: children && children.options,
            },
            injectStore: combine(children ? children.injectStore : noop, gettersInstance ? gettersInstance.injectStore : noop, mutationsInstance ? mutationsInstance.injectStore : noop, actionsInstance ? actionsInstance.injectStore : noop),
        };
    };
    return Module;
}());
export { Module };
export function hotUpdate(store, module) {
    var _a = module.create([], ''), options = _a.options, injectStore = _a.injectStore;
    store.hotUpdate(options);
    injectStore(store);
}
function initGetters(Getters, module) {
    var getters = new Getters();
    var options = {};
    // Proxy all getters to print useful warning on development
    function proxyGetters(getters, origin) {
        var proxy = Object.create(getters);
        Object.keys(options).forEach(function (key) {
            Object.defineProperty(proxy, key, {
                get: function () {
                    error("You are accessing " + Getters.name + "#" + key + " from " + Getters.name + "#" + origin +
                        ' but direct access to another getter is prohibitted.' +
                        (" Access it via this.getters." + key + " instead."));
                    return getters[key];
                },
                configurable: true,
            });
        });
        return proxy;
    }
    traverseDescriptors(Getters.prototype, BaseGetters, function (desc, key) {
        if (typeof desc.value !== 'function' && !desc.get) {
            return;
        }
        var methodFn = desc.value;
        var getterFn = desc.get;
        options[key] = function () {
            var proxy = process.env.NODE_ENV === 'production'
                ? getters
                : proxyGetters(getters, key);
            if (getterFn) {
                return getterFn.call(proxy);
            }
            if (methodFn) {
                return methodFn.bind(proxy);
            }
        };
    }, {
        constructor: true,
        $init: true,
    });
    return {
        getters: options,
        injectStore: function (store) {
            var context = module.context(store);
            if (!getters.hasOwnProperty('__ctx__')) {
                Object.defineProperty(getters, '__ctx__', {
                    get: function () { return context; },
                });
            }
            getters.$init(store);
        },
    };
}
function initMutations(Mutations, module) {
    var mutations = new Mutations();
    var options = {};
    // Proxy all mutations to print useful warning on development
    function proxyMutations(mutations, origin) {
        var proxy = Object.create(mutations);
        Object.keys(options).forEach(function (key) {
            proxy[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                error("You are accessing " + Mutations.name + "#" + key + " from " + Mutations.name + "#" + origin +
                    ' but accessing another mutation is prohibitted.' +
                    ' Use an action to consolidate the mutation chain.');
                mutations[key].apply(mutations, args);
            };
        });
        return proxy;
    }
    traverseDescriptors(Mutations.prototype, BaseMutations, function (desc, key) {
        if (typeof desc.value !== 'function') {
            return;
        }
        options[key] = function (_, payload) {
            var proxy = process.env.NODE_ENV === 'production'
                ? mutations
                : proxyMutations(mutations, key);
            return mutations[key].call(proxy, payload);
        };
    });
    return {
        mutations: options,
        injectStore: function (store) {
            var context = module.context(store);
            if (!mutations.hasOwnProperty('__ctx__')) {
                Object.defineProperty(mutations, '__ctx__', {
                    get: function () { return context; },
                });
            }
        },
    };
}
function initActions(Actions, module) {
    var actions = new Actions();
    var options = {};
    // Proxy all actions to print useful warning on development
    function proxyActions(actions, origin) {
        var proxy = Object.create(actions);
        Object.keys(options).forEach(function (key) {
            proxy[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                error("You are accessing " + Actions.name + "#" + key + " from " + Actions.name + "#" + origin +
                    ' but direct access to another action is prohibitted.' +
                    (" Access it via this.dispatch('" + key + "') instead."));
                actions[key].apply(actions, args);
            };
        });
        return proxy;
    }
    traverseDescriptors(Actions.prototype, BaseActions, function (desc, key) {
        if (typeof desc.value !== 'function') {
            return;
        }
        options[key] = function (_, payload) {
            var proxy = process.env.NODE_ENV === 'production'
                ? actions
                : proxyActions(actions, key);
            return actions[key].call(proxy, payload);
        };
    }, {
        constructor: true,
        $init: true,
    });
    return {
        actions: options,
        injectStore: function (store) {
            var context = module.context(store);
            if (!actions.hasOwnProperty('__ctx__')) {
                Object.defineProperty(actions, '__ctx__', {
                    get: function () { return context; },
                });
            }
            actions.$init(store);
        },
    };
}
