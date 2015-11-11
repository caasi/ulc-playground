import internals from './internals';

function id(it) { return it }

function unknownNode(node) {
  new Error(`unknown node type: ${node[0]}`);
}

function weakNormalForm(node, subs) {
  switch (node[0]) {
    case 'var':
      return internals[node[1]] || node;
    case 'lam':
      return node;
    case 'app':
      let lam = weakNormalForm(node[1], subs);
      return lam[0] !== 'lam'
        ? node
        : weakNormalForm(subs(lam[2], node[2]), subs)
    case 'int':
      return node;
    default:
      throw unknownNode(node);
  }
}

function normalForm(node, subs) {
  switch (node[0]) {
    case 'var':
      return node;
    case 'lam':
      return ['lam', node[1], normalForm(node[2], subs)];
    case 'app':
      let lam = weakNormalForm(node[1], subs);
      return lam[0] !== 'lam'
        ? ['app', normalForm(node[1], subs), normalForm(node[2], subs)]
        : normalForm(subs(lam[2], node[2]), subs)
    case 'int':
      // evaluate all the arguments(call by value)
      let args = node[3].map(arg => normalForm(arg, subs));
      return node[2].apply(this, args);
    default:
      throw unknownNode(node);
  }
}

export default function interpret(node, subs, before = id) {
  return normalForm(before(node), subs);
}
