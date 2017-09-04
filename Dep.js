let uuid = 0
/**
 * 依赖订阅中间件
 */
module.exports = class Dep {
  constructor() {
    this.id = uuid++
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  removeSub(watcher) {
    let index = this.subs.indexOf(watcher)
    ~index && this.subs.splice(index, 1)
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}
