import internals from './internals';

function id(it) { return it }

function show(it) { return console.log(it) || it }

// XXX: lame
function replaceWithInternals(node) {
  switch (node[0]) {
    case 'var':
      while (node[2] === 0) {
        let internal = internals[node[1]];
        if (internal) {
          node.splice(0);
          node.push(...internal());
        } else {
          break;
        }
      }
      return;
    case 'lam':
      replaceWithInternals(node[2]);
      return
    case 'app':
      replaceWithInternals(node[1]);
      replaceWithInternals(node[2]);
      return;
    case 'int':
      return;
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

function normalForm(node, subs, step = id, dispatch = id) {
  return new Promise((resolve, reject) => {
    // XXX: lame!
    replaceWithInternals(node);

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
          // XXX: strict
          Promise.all(redex[3].map(arg =>
            normalForm(arg, subs, id, dispatch)
              .then(normal => normal || arg)
          ))
            // pad the dispatcher as the last argument
            .then(args => args.concat([dispatch]))
            // redex[2] can return a Promise
            .then(args => redex[2].apply(this, args))
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
    .then(node => node ? normalForm(node, subs, step, dispatch) : null);
}

export default function interpret(node, subs, before = id, step = id, dispatch = id) {
  node = before(node);
  return normalForm(node, subs, step, dispatch);
}
