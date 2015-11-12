import internals from './internals';

function id(it) { return it }

function unknownNode(node) {
  new Error(`unknown node type: ${node[0]}`);
}

function weakNormalForm(node, subs, step) {
  return new Promise((resolve, reject) => {
    switch (node[0]) {
      case 'var':
        let internal = internals[node[1]];
        resolve(internal ? internal() : node);
        break;
      case 'lam':
        resolve(node);
        break;
      case 'app':
        weakNormalForm(node[1], subs, step)
          .then(lam => (
            lam[0] !== 'lam'
              ? node
              : weakNormalForm(subs(lam[2], node[2]), subs, step)
          ))
          .then(resolve);
        break;
      case 'int':
        Promise.all(node[3].map(arg => normalForm(arg, subs, step)))
          .then(args => node[2].apply(this, args))
          .then(resolve);
        break;
      default:
        reject(unknownNode(node));
    }
  })
    .then(step);
}

function normalForm(node, subs, step) {
  return new Promise((resolve, reject) => {
    switch (node[0]) {
      case 'var':
        resolve(node);
        break;
      case 'lam':
        normalForm(node[2], subs, step)
          .then(node2 => ['lam', node[1], node2])
          .then(resolve);
        break;
      case 'app':
        weakNormalForm(node[1], subs, step)
          .then(lam => (
            lam[0] !== 'lam'
              ? Promise.all([normalForm(node[1], subs, step), normalForm(node[2], subs, step)])
                  .then(([node1, node2]) => ['app', node1, node2])
              : normalForm(subs(lam[2], node[2]), subs, step)
          ))
          .then(resolve);
        break;
      case 'int':
        // evaluate all the arguments(call by value)
        Promise.all(node[3].map(arg => normalForm(arg, subs, step)))
          .then(args => node[2].apply(this, args))
          .then(resolve);
        break;
      default:
        reject(unknownNode(node));
    }
  })
    .then(step);
}

export default function interpret(node, subs, before = id, step = id) {
  return normalForm(before(node), subs, step);
}
