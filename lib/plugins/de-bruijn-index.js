function unknownNode(node) {
  return new Error(`unknown node type: ${node[0]}`);
}

function increase(node, value, depth = 0) {
  switch (node[0]) {
    case 'var':
      let index = node[2] > depth ? node[2] + value : node[2];
      return ['var', node[1], index];
    case 'app':
      return ['app',
        increase(node[1], value, depth),
        increase(node[2], value, depth)];
    case 'lam':
      return ['lam', node[1], increase(node[2], value, depth + 1)];
    case 'int':
      let args = node[3].map(arg => increase(arg, value, depth + 1));
      return ['int', node[1], node[2], args];
    default:
      throw unknownNode(node);
  }
}

export function annotate(node, distances = {}) {
  switch (node[0]) {
    case 'var':
      return ['var', node[1], distances[node[1]] || 0];
    case 'app':
      return ['app', annotate(node[1], distances), annotate(node[2], distances)];
    case 'lam':
      let d = {};
      for (let k in distances) {
        d[k] = distances[k] + 1;
      }
      d[node[1]] = 1;
      return ['lam', node[1], annotate(node[2], d)];
    case 'int':
      return node;
    default:
      throw unkonwnNode(node);
  }
}

export function subs(node, arg, depth = 1) {
  switch (node[0]) {
    case 'var':
      if (node[2] > depth)   return ['var', node[1], node[2] - 1];
      if (node[2] === depth) return increase(arg, depth - 1);
      if (node[2] < depth)   return node;
    case 'app':
      return ['app',
        subs(node[1], arg, depth),
        subs(node[2], arg, depth)];
    case 'lam':
      return ['lam', node[1], subs(node[2], arg, depth + 1)];
    case 'int':
      for (let k in node[1]) {
        let d = node[1][k];
        if (d === depth) {
          node[3][k] = increase(arg, depth - 1);
        }
      }
      return node;
    default:
      throw unknownNode(node);
  }
}
