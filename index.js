const observer = require("./Observer.js")
const Watcher = require("./Watcher.js")

let data = {
  a: 1,
  b: {
    c: 1
  }
}
/**观察里面所有属性 */
observer(data)

new Watcher(data, 'a', value => {
  console.log('a被修改了:', value)
})
new Watcher(data, 'b.c', value => {
  console.log("b.c被修改了:", value)
})

data.a = 2
data.b.c = 3
data.b = { c: 4 }
data.b = { c: 3 }
