/*!
 * vuex-smart-module v0.4.6
 * https://github.com/ktsn/vuex-smart-module
 *
 * @license
 * Copyright (c) 2018 katashin
 * Released under the MIT license
 * https://github.com/ktsn/vuex-smart-module/blob/master/LICENSE
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vuex')) :
    typeof define === 'function' && define.amd ? define(['exports', 'vuex'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.VuexSmartModule = {}, global.Vuex));
}(this, (function (exports, vuex) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function inject(F, injection) {
        var proto = F.prototype;
        var descs = {};
        Object.keys(injection).forEach(function (key) {
            descs[key] = {
                configurable: true,
                enumerable: true,
                writable: true,
                value: injection[key],
            };
        });
        return Object.create(proto, descs);
    }
    var Getters = /** @class */ (function () {
        function Getters() {
        }
        Getters.prototype.$init = function (_store) { };
        Object.defineProperty(Getters.prototype, "state", {
            get: function () {
                return this.__ctx__.state;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Getters.prototype, "getters", {
            get: function () {
                return this.__ctx__.getters;
            },
            enumerable: false,
            configurable: true
        });
        return Getters;
    }());
    var Mutations = /** @class */ (function () {
        function Mutations() {
        }
        Object.defineProperty(Mutations.prototype, "state", {
            get: function () {
                return this.__ctx__.state;
            },
            enumerable: false,
            configurable: true
        });
        return Mutations;
    }());
    var Actions = /** @class */ (function () {
        function Actions() {
        }
        Actions.prototype.$init = function (_store) { };
        Object.defineProperty(Actions.prototype, "state", {
            get: function () {
                return this.__ctx__.state;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Actions.prototype, "getters", {
            get: function () {
                return this.__ctx__.getters;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Actions.prototype, "commit", {
            get: function () {
                return this.__ctx__.commit;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Actions.prototype, "dispatch", {
            get: function () {
                return this.__ctx__.dispatch;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Actions.prototype, "actions", {
            /**
             * IMPORTANT: Each action type maybe incorrect - return type of all actions should be `Promise<any>`
             * but the ones under `actions` are same as what you declared in this actions class.
             * The reason why we declare the type in such way is to avoid recursive type error.
             * See: https://github.com/ktsn/vuex-smart-module/issues/30
             */
            get: function () {
                return this.__ctx__.actions;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Actions.prototype, "mutations", {
            get: function () {
                return this.__ctx__.mutations;
            },
            enumerable: false,
            configurable: true
        });
        return Actions;
    }());

    var noop = function () { };
    function combine() {
        var fs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fs[_i] = arguments[_i];
        }
        return function (x) {
            fs.forEach(function (f) { return f(x); });
        };
    }
    function get(path, value) {
        return path.reduce(function (acc, key) {
            return acc[key];
        }, value);
    }
    function mapValues(record, fn) {
        var res = {};
        Object.keys(record).forEach(function (key) {
            res[key] = fn(record[key], key);
        });
        return res;
    }
    function error(message) {
        console.error("[vuex-smart-module] " + message);
    }
    function assert(condition, message) {
        if (!condition) {
            throw new Error("[vuex-smart-module] " + message);
        }
    }
    function deprecated(message) {
        console.warn("[vuex-smart-module] DEPRECATED: " + message);
    }
    function traverseDescriptors(proto, Base, fn, exclude) {
        if (exclude === void 0) { exclude = { constructor: true }; }
        if (proto.constructor === Base) {
            return;
        }
        Object.getOwnPropertyNames(proto).forEach(function (key) {
            // Ensure to only choose most extended properties
            if (exclude[key])
                return;
            exclude[key] = true;
            var desc = Object.getOwnPropertyDescriptor(proto, key);
            fn(desc, key);
        });
        traverseDescriptors(Object.getPrototypeOf(proto), Base, fn, exclude);
    }
    function gatherHandlerNames(proto, Base) {
        var ret = [];
        traverseDescriptors(proto, Base, function (desc, name) {
            if (typeof desc.value !== 'function') {
                return;
            }
            ret.push(name);
        });
        return ret;
    }

    function createLazyContextPosition(module) {
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
    function commit(store, namespace, type, payload, options) {
        normalizedDispatch(store.commit, namespace, type, payload, options);
    }
    function dispatch(store, namespace, type, payload, options) {
        return normalizedDispatch(store.dispatch, namespace, type, payload, options);
    }
    function getters(store, namespace) {
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
                    var mutationNames = gatherHandlerNames(mutationsClass.prototype, Mutations);
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
                    var actionNames = gatherHandlerNames(actionsClass.prototype, Actions);
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

    function createMapper(module) {
        return new ComponentMapper(createLazyContextPosition(module));
    }
    var ComponentMapper = /** @class */ (function () {
        function ComponentMapper(pos) {
            this.pos = pos;
        }
        ComponentMapper.prototype.mapState = function (map) {
            var pos = this.pos;
            return createMappedObject(map, function (value) {
                return function mappedStateComputed() {
                    var state = get(pos.path, this.$store.state);
                    if (typeof value === 'function') {
                        var getters$1 = getters(this.$store, pos.namespace);
                        return value.call(this, state, getters$1);
                    }
                    else {
                        return state[value];
                    }
                };
            });
        };
        ComponentMapper.prototype.mapGetters = function (map) {
            var pos = this.pos;
            return createMappedObject(map, function (value) {
                function mappedGetterComputed() {
                    return this.$store.getters[pos.namespace + value];
                }
                // mark vuex getter for devtools
                mappedGetterComputed.vuex = true;
                return mappedGetterComputed;
            });
        };
        ComponentMapper.prototype.mapMutations = function (map) {
            var pos = this.pos;
            return createMappedObject(map, function (value) {
                return function mappedMutationMethod() {
                    var _this = this;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var commit$1 = function (type, payload) {
                        return commit(_this.$store, pos.namespace, type, payload);
                    };
                    return typeof value === 'function'
                        ? value.apply(this, [commit$1].concat(args))
                        : commit$1(value, args[0]);
                };
            });
        };
        ComponentMapper.prototype.mapActions = function (map) {
            var pos = this.pos;
            return createMappedObject(map, function (value) {
                return function mappedActionMethod() {
                    var _this = this;
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var dispatch$1 = function (type, payload) {
                        return dispatch(_this.$store, pos.namespace, type, payload);
                    };
                    return typeof value === 'function'
                        ? value.apply(this, [dispatch$1].concat(args))
                        : dispatch$1(value, args[0]);
                };
            });
        };
        return ComponentMapper;
    }());
    function createMappedObject(map, fn) {
        var normalized = !Array.isArray(map)
            ? map
            : map.reduce(function (acc, key) {
                acc[key] = key;
                return acc;
            }, {});
        return mapValues(normalized, fn);
    }

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
    function hotUpdate(store, module) {
        var _a = module.create([], ''), options = _a.options, injectStore = _a.injectStore;
        store.hotUpdate(options);
        injectStore(store);
    }
    function initGetters(Getters$1, module) {
        var getters = new Getters$1();
        var options = {};
        // Proxy all getters to print useful warning on development
        function proxyGetters(getters, origin) {
            var proxy = Object.create(getters);
            Object.keys(options).forEach(function (key) {
                Object.defineProperty(proxy, key, {
                    get: function () {
                        error("You are accessing " + Getters$1.name + "#" + key + " from " + Getters$1.name + "#" + origin +
                            ' but direct access to another getter is prohibitted.' +
                            (" Access it via this.getters." + key + " instead."));
                        return getters[key];
                    },
                    configurable: true,
                });
            });
            return proxy;
        }
        traverseDescriptors(Getters$1.prototype, Getters, function (desc, key) {
            if (typeof desc.value !== 'function' && !desc.get) {
                return;
            }
            var methodFn = desc.value;
            var getterFn = desc.get;
            options[key] = function () {
                var proxy =  proxyGetters(getters, key);
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
    function initMutations(Mutations$1, module) {
        var mutations = new Mutations$1();
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
                    error("You are accessing " + Mutations$1.name + "#" + key + " from " + Mutations$1.name + "#" + origin +
                        ' but accessing another mutation is prohibitted.' +
                        ' Use an action to consolidate the mutation chain.');
                    mutations[key].apply(mutations, args);
                };
            });
            return proxy;
        }
        traverseDescriptors(Mutations$1.prototype, Mutations, function (desc, key) {
            if (typeof desc.value !== 'function') {
                return;
            }
            options[key] = function (_, payload) {
                var proxy =  proxyMutations(mutations, key);
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
    function initActions(Actions$1, module) {
        var actions = new Actions$1();
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
                    error("You are accessing " + Actions$1.name + "#" + key + " from " + Actions$1.name + "#" + origin +
                        ' but direct access to another action is prohibitted.' +
                        (" Access it via this.dispatch('" + key + "') instead."));
                    actions[key].apply(actions, args);
                };
            });
            return proxy;
        }
        traverseDescriptors(Actions$1.prototype, Actions, function (desc, key) {
            if (typeof desc.value !== 'function') {
                return;
            }
            options[key] = function (_, payload) {
                var proxy =  proxyActions(actions, key);
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

    function registerModule(store, path, namespace, module, options) {
        var normalizedPath = typeof path === 'string' ? [path] : path;
        var _a = module.create(normalizedPath, normalizeNamespace(namespace)), moduleOptions = _a.options, injectStore = _a.injectStore;
        store.registerModule(normalizedPath, moduleOptions, options);
        injectStore(store);
    }
    function unregisterModule(store, module) {
        assert(module.path, 'The module seems not registered in the store');
        store.unregisterModule(module.path);
    }
    function normalizeNamespace(namespace) {
        if (namespace === '' || namespace === null) {
            return '';
        }
        return namespace[namespace.length - 1] === '/' ? namespace : namespace + '/';
    }

    function createStore(rootModule, options) {
        if (options === void 0) { options = {}; }
        var _a = rootModule.create([], ''), rootModuleOptions = _a.options, injectStore = _a.injectStore;
        var store = new vuex.Store(__assign(__assign(__assign({}, rootModuleOptions), options), { modules: __assign(__assign({}, rootModuleOptions.modules), options.modules), plugins: [injectStore].concat(options.plugins || []) }));
        return store;
    }

    exports.Actions = Actions;
    exports.Context = Context;
    exports.Getters = Getters;
    exports.Module = Module;
    exports.Mutations = Mutations;
    exports.createMapper = createMapper;
    exports.createStore = createStore;
    exports.hotUpdate = hotUpdate;
    exports.inject = inject;
    exports.registerModule = registerModule;
    exports.unregisterModule = unregisterModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
