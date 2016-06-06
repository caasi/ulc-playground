const compose = f => g => x => f(g(x))

// type constructor:
// (->) :: * -> * -> *
// value constructor:
// (->) r a :: (r -> a) -> (->) r a
// 可是這樣就拆不出 r 和 a 了...
const Func = f => {
  let value = f
  value.fmap = Func.fmap
  return value
}
Func.fmap = f => g => compose(f)(g)

// main
let plus = Func(a => Func(b => a + b))
let mult = Func(a => Func(b => a * b))

let { fmap } = plus
console.log(fmap(plus(2))(mult(3))(4))

