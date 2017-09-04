const Dep = require("./Dep.js")
const toString = Object.prototype.toString
function isObject(obj) {
  return toString.call(obj) === "[object Object]"
}
function isFunction(fun) {
  return toString.call(fun) === "[object Function]"
}
function neddParams(message) {
  throw message
}
/**
 * 依赖订阅器
 */
module.exports = class Watcher {
  /**
   * 
   * @param {Object} data 
   * @param {string|Function} [expOrFn=neddParams("Watcher need expOrFn")] 
   * @param {function} [callback=neddParams("Watcher need callback")] 
   */
  constructor(data, expOrFn = neddParams("Watcher need expOrFn"), callback = neddParams("Watcher need callback")) {
    if (!isObject(data)) {
      throw "watcher target must an object"
    }
    this.data = data
    this.expOrFn = expOrFn
    this.depIds = {}
    if (isFunction(expOrFn)) {
      this.getter = expOrFn
    } else {
      this.getter = this.parseGetter(expOrFn)
    }
    this.callback = callback
    this.value = this.get()
  }
  addDep(dep) {
    //依赖没有添加到当前监听器，则添加，已经添加就忽略
    if (!this.depIds[dep.id]) {
      dep.addSub(this)
      this.depIds[dep.id] = true
    }
  }
  get() {
    Dep.target = this
    //递归访问属性，并且绑定父属对象的dep到当前依赖,如果父对象被整体赋值，也可以被监听到改变
    let value = this.getter.call(this.data, this.data)
    Dep.target = null
    return value
  }
  parseGetter(exp) {
    //如果不是合法的属性访问表达式将直接返回空
    if (/[^\w.$]/.test(exp)) throw Error(`property access expression error!\"${exp}\"`);

    var exps = exp.split('.');

    return function (data) {
      for (var i = 0, len = exps.length; i < len; i++) {
        if (!data) return;
        data = data[exps[i]];
      }
      return data;
    }
  }
  update() {
    let value = this.get()
    let oldVal = this.value
    //触发更新需要比较新值和旧值
    //因为有可能是父对象被赋值导致的更新，并非被监听属性值发生变化导致
    if (value !== oldVal) {
      this.callback(value, oldVal)
    }
  }
}
