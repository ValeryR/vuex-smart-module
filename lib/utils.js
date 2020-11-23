export var noop = function () { };
export function combine() {
    var fs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fs[_i] = arguments[_i];
    }
    return function (x) {
        fs.forEach(function (f) { return f(x); });
    };
}
export function get(path, value) {
    return path.reduce(function (acc, key) {
        return acc[key];
    }, value);
}
export function mapValues(record, fn) {
    var res = {};
    Object.keys(record).forEach(function (key) {
        res[key] = fn(record[key], key);
    });
    return res;
}
export function error(message) {
    console.error("[vuex-smart-module] " + message);
}
export function assert(condition, message) {
    if (!condition) {
        throw new Error("[vuex-smart-module] " + message);
    }
}
export function deprecated(message) {
    console.warn("[vuex-smart-module] DEPRECATED: " + message);
}
export function traverseDescriptors(proto, Base, fn, exclude) {
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
export function gatherHandlerNames(proto, Base) {
    var ret = [];
    traverseDescriptors(proto, Base, function (desc, name) {
        if (typeof desc.value !== 'function') {
            return;
        }
        ret.push(name);
    });
    return ret;
}
