define(["require", "exports", "bluebird", "./ajax"], function (require, exports, Promise, ajax_1) {
    "use strict";
    console.log(Promise);
    console.log(ajax_1.ajax);
    function fakeQuery(subject) {
        var events = {};
        if (subject && subject === subject.window)
            return {
                0: subject,
                load: function (handler) { return subject.addEventListener('load', handler, false); },
                bind: function (event, handler) { return subject.addEventListener(event, handler, false); },
                unbind: function (event, handler) { return subject.removeEventListener(event, handler, false); }
            };
        return {
            0: subject,
            unbind: function (event, handler) {
                var handlers = events[event] || [];
                if (handler) {
                    var idx = handlers.indexOf(handler);
                    if (idx !== -1)
                        handlers.splice(idx, 1);
                }
                else
                    handlers = [];
                events[event] = handlers;
            },
            bind: function (event, handler) {
                var current = events[event] || [];
                events[event] = current.concat(handler);
            },
            triggerHandler: function (event, args) {
                var handlers = events[event] || [];
                handlers.forEach(function (fn) { return fn.call.apply(fn, [{ type: event }].concat(args)); });
            }
        };
    }
    var jquery = window.jQuery = Object.assign(fakeQuery, {
        ajax: ajax_1.ajax,
        noop: function () { },
        isFunction: function (o) { return typeof o === 'function'; },
        isArray: function (arr) { return Array.isArray(arr); },
        type: function (obj) { return typeof obj; },
        trim: function (str) { return str && str.trim(); },
        extend: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return Object.assign.apply(Object, args);
        },
        each: function (arr, cb) {
            console.log(arguments);
            for (var k in arr) {
                cb(k, arr[k]);
            }
            //   arr.forEach((v, i) => cb(i, v))
        },
        isEmptyObject: function (obj) { return !obj || Object.keys(obj).length === 0; },
        makeArray: function (arr) { return [].slice.call(arr, 0); },
        Deferred: function () {
            var resolve, reject;
            var promise = new Promise(function () {
                resolve = arguments[0];
                reject = arguments[1];
            });
            console.log([resolve, reject, promise]);
            return { resolve: resolve, reject: reject, promise: function () { return promise; } };
        },
        support: {
            cors: ('withCredentials' in new XMLHttpRequest())
        }
    });
    return jquery;
});
//# sourceMappingURL=jQuery.js.map