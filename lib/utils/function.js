const compose = f => g => x => f(g(x))

// type constructor:
// (->) :: * -> * -> *
// (->) r a :: r -> a -> (->) r a
const Func = r => {
  let value = a => {
    let value = f => f(r)(a)
    value.toString = () => `${r} -> ${a}`
    return value
  }
  value.toString = () => `(->) ${r}`
  value.fmap = f => funcR => compose(f)(funcR)
  return value
}

// main
let func8 = Func(8)
let func9 = Func(9)
console.log(func8, func9)

// it reminds me the keyword `with`
let { fmap } = func8
console.log(fmap(func8)(func9)(64))
