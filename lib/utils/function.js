const compose = f => g => x => f(g(x))

// type constructor:
// (->) :: * -> * -> *
// value constructor:
// (->) r a :: (r -> a) -> (->) r a
const Func = f => r => {
  let value = g => g(r)(f(r))
  return value
}

const unFunc = f => f(r => a => r)
const evaluate = f => f(r => a => a)

// main
const twice = Func(x => x + x)
const ret = twice(3)

console.log('unFunc: ', unFunc(ret))
console.log('evaluate: ', evaluate(ret))

