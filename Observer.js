const Dep = require("./Dep.js")
function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]"
}
/**
 * 
 * 对象观察者
 * 
 * @class Observer
 */
class Observer {
  constructor(data) {
    this.data = data
    this.walk(data)
  }
  walk(data) {
    Object.keys(data).forEach(key => { this.defineReactive(this.data, key, data[key]) })
  }

  defineReactive(data, key, value) {
    let dep = new Dep()
    observer(value)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        if (Dep.target) {
          //在watcher里面调用get的时候会订阅改属性的访问
          Dep.target.addDep(dep)
        }
        return value
      },
      set(val) {
        if (val === value) {
          return
        }
        value = val
        observer(val)
        dep.notify()
      }
    })
  }
}
function observer(data) {
  if (!isObject(data)) {
    return null
  }
  return new Observer(data)
}
module.exports = observer
