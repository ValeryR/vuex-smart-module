import { getters as namespacedGetters, commit as namespacedCommit, dispatch as namespacedDispatch, createLazyContextPosition, } from './context';
import { mapValues, get } from './utils';
export function createMapper(module) {
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
                    var getters = namespacedGetters(this.$store, pos.namespace);
                    return value.call(this, state, getters);
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
                var commit = function (type, payload) {
                    return namespacedCommit(_this.$store, pos.namespace, type, payload);
                };
                return typeof value === 'function'
                    ? value.apply(this, [commit].concat(args))
                    : commit(value, args[0]);
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
                var dispatch = function (type, payload) {
                    return namespacedDispatch(_this.$store, pos.namespace, type, payload);
                };
                return typeof value === 'function'
                    ? value.apply(this, [dispatch].concat(args))
                    : dispatch(value, args[0]);
            };
        });
    };
    return ComponentMapper;
}());
export { ComponentMapper };
function createMappedObject(map, fn) {
    var normalized = !Array.isArray(map)
        ? map
        : map.reduce(function (acc, key) {
            acc[key] = key;
            return acc;
        }, {});
    return mapValues(normalized, fn);
}
