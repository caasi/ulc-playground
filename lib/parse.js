const nameExp = /[^\(\)\\\s]/;

function panic(c, pos) {
  return new Error(`parse error near '${c}' at ${pos}`);
}

function parseVar(cs, start, end) {
  return ['var', cs.slice(start, end).join('')];
}

function parseLam(cs, start, end) {
  let root = ['lam'];
  let i = start;

  while (i < end) {
    if (cs[i] === '\\') {
      let j = i + 1;
      while (nameExp.test(cs[j])) {
        if (cs[j] === undefined) throw panic(cs[j-1], j-1);
        ++j;
      }
      root.push(cs.slice(i + 1, j).join(''));
      let func = cs[j] === '\\' ? parseLam : parseApp;
      root.push(func(cs, j + 1, end));
      i = end;
    } else {
      ++i;
    }
  }

  return root;
}

function parseApp(cs, start, end) {
  let ranges = [];
  let root = [];
  let prev = root;
  let i = start;

  while (i < end) {
    if (cs[i] === '(') {
      let j = i + 1;
      let depth = 1;
      while (true) {
        let c = cs[j];
        if (c === undefined) throw panic(cs[j-1], j-1);
        ++j;
        if (c === '(') ++depth;
        if (c === ')') --depth;
        if (depth === 0) break;
      }
      ranges.push([parseApp, i + 1, j - 1]);
      i = j;
    } else if (cs[i] === '\\') {
      ranges.push([parseLam, i, end]);
      i = end;
    } else if (nameExp.test(cs[i])) {
      let j = i + 1;
      while (nameExp.test(cs[j])) {
        if (cs[j] === undefined) throw panic(cs[j-1], j-1);
        ++j;
      }
      ranges.push([parseVar, i, j]);
      i = j;
    } else {
      ++i;
    }
  }

  let range;
  while (range = ranges.pop()) {
    let node = [range[0](cs, range[1], range[2])];
    prev = prev.unshift('app', node);
    prev = node;
  }

  let tmp = prev.pop() || [];
  for (let content of tmp) prev.push(content);

  return root[1];
}

export default function parse(str) {
  let cs = Array.from(str);
  return parseApp(cs, 0, cs.length);
}
