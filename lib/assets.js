export function inject(F, injection) {
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
export { Getters };
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
export { Mutations };
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
export { Actions };
