
import * as Promise from "bluebird";
import { ajax } from "./ajax";

console.log(Promise);
console.log(ajax);

function fakeQuery(subject): any{
  let events = {};

  if (subject && subject === subject.window)
    return {
      0: subject,
      load: (handler)=> subject.addEventListener('load', handler, false),
      bind: (event, handler)=> subject.addEventListener(event, handler, false),
      unbind: (event, handler)=> subject.removeEventListener(event, handler, false)
    }

  return {
    0: subject,

    unbind(event, handler){
      let handlers = events[event] || [];

      if (handler){
        let idx = handlers.indexOf(handler);
        if (idx !== -1) handlers.splice(idx, 1)
      }
      else handlers = []

      events[event] = handlers
    },
    bind(event, handler){
      let current = events[event] || [];
      events[event] = current.concat(handler)
    },
    triggerHandler(event, args){
      let handlers = events[event] || [];
      handlers.forEach( fn => fn.call({ type: event }, ...args))
    }
  }
}

var jquery = window.jQuery = Object.assign(fakeQuery, {
  ajax,
  noop(){},
  isFunction: o => typeof o === 'function',
  isArray: arr => Array.isArray(arr),
  type: obj => typeof obj,
  trim: str => str && str.trim(),
  extend: (...args) => Object.assign(...args),
  each: function (arr, cb) {
      console.log(arguments);
      for (let k in arr) {
          cb(k, arr[k]);
      }
   //   arr.forEach((v, i) => cb(i, v))
  },
  isEmptyObject: obj => !obj || Object.keys(obj).length === 0,
  makeArray: arr => [].slice.call(arr, 0),
  Deferred(){
    var resolve, reject;
    var promise = new Promise(function() {
      resolve = arguments[0];
      reject = arguments[1];
    });
    console.log([resolve, reject, promise]);
    return { resolve, reject, promise: ()=> promise };
  },
  support: {
    cors: ('withCredentials' in new XMLHttpRequest())
  }
})


export = jquery;

