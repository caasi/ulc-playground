import internals from './internals';

function id(it) { return it }

function show(it) { return console.log(it) || it }

function enableInternals(node) {
  switch (node[0]) {
    case 'var':
      let internal = internals[node[1]];
      return internal ? internal() : node;
    case 'lam':
      return ['lam', node[1], enableInternals(node[2])];
    case 'app':
      return ['app', enableInternals(node[1]), enableInternals(node[2])];
    default:
      throw new Error(`unknown node type: ${node[0]}`);
  }
}

function search(node) {
  switch (node[0]) {
    case 'var':
      return null;
    case 'lam':
      return search(node[2]);
    case 'app':
      return node[1][0] === 'lam'
        ? node
        : search(node[1]) || search(node[2]);
    case 'int':
      return node;
    default:
      throw new Error(`unknown node type: ${node[0]}`);
  }
}

function normalForm(node, subs, step = id) {
  return new Promise((resolve, reject) => {
    let redex = search(node);

    if (!redex) {
      resolve(null);
    } else {
      switch (redex[0]) {
        case 'app':
          let lam = redex[1];
          let arg = redex[2];
          redex.splice(0);
          redex.push(...subs(lam[2], arg));
          resolve(node);
          break;
        case 'int':
          Promise.all(redex[3].map(arg => normalForm(arg, subs)))
            .then(() => redex[2].apply(this, redex[3]))
            .then(result => {
              redex.splice(0);
              redex.push(...result);
              resolve(node);
            });
          break
        default:
          reject(new Error(`not a redex: ${redex[0]}`));
      }
    }
  })
    .then(step)
    .then(node => node ? normalForm(node, subs, step) : null);
}

export default function interpret(node, subs, before = id, step = id) {
  node = enableInternals(before(node));
  return normalForm(node, subs, step);
}
