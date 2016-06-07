// type constructor:
// Person :: *
// value constructor:
// Person :: { fullname :: String, address :: String }
// Person :: String -> String -> Person
const Person = fullname => address => f => f(fullname)(address)
Person.fullname = p => (
  p(fullname => address => fullname)
)
Person.address = p => (
  p(fullname => address => address)
)

const Address = address => postal => f => f(address)(postal)
Address.address = p => (
  p(address => postal => address)
)
Address.postal = p => (
  p(address => postal => postal)
)

// type constructor:
// Const :: * -> * -> *
// value constructor:
// Const v :: v -> Const v a
const Const = v => {
  let value = f => f(v)()
  value.fmap = Const.fmap // XXX
  return value
}
Const.fmap = f => c => c

// getConst :: Const v -> v
// Const v 是上面那個 (f) => f(v)
const getConst = c => (
  c(v => a => v) // XXX
)

// type constructor:
// Identity :: * -> *
// value constructor:
// Identity a :: a -> Identity a
const Identity = a => {
  let value = f => f(a)
  value.fmap = Identity.fmap
  return value
}
Identity.fmap = f => i => i(a => Identity(f(a)))

// getIdentity :: Identity a -> a
const getIdentity = i => (
  i(a => a)
)

const view = ln => struct => (
  getConst(ln(Const)(struct))
)

const set = ln => value => struct => {
  let set_fld = a => Identity(value)
  return getIdentity(ln(set_fld)(struct))
}

// the lens
const fullname = fn => p => (
  p(fullname => address => {
    let o = fn(fullname)
    // (n -> Person n address) <$> (fn fullname)
    return o.fmap(n => Person(n)(address))(o)
  })
)

const address = fn => p => (
  p(fullname => address => {
    let o = fn(address)
    // (n -> Person n address) <$> (fn fullname)
    return o.fmap(n => Person(fullname)(n))(o)
  })
)

const postal = fn => p => (
  p(address => postal => {
    let o = fn(postal)
    return o.fmap(n => Person(address)(n))(o)
  })
)

const compose = f => g => x => f(g(x))

// main
let p = Person('Alyssa P. Hacker')(Address('Cambridge Mass Ave. 78')(40466))
console.log(Person.fullname(p))

console.log(view(fullname)(p))
console.log(view(compose(postal)(address))(p))

let p$ = set(fullname)('Eva Lu Ator')(p)
console.log(view(fullname)(p$))
