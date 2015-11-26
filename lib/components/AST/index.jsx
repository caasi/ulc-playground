import React from 'react';

import styles from './index.css';

const Var = props => (
  <div className="term variable">
    <div>["var", "{props.name}"]</div>
  </div>
);

const Lam = props => (
  <div className="term abstraction">
    <div>["lam", "{props.name}",</div>
    {props.children}
    <div>]</div>
  </div>
);

const App = props => (
  <div className="term application">
    <div>["app",</div>
    {props.children}
    <div>]</div>
  </div>
);

const Int = props => (
  <div className="term internal">
    <div>["int", {props.body && props.body.toString()}]</div>
  </div>
);

function construct(tree) {
  switch (tree[0]) {
    case 'var':
      return <Var name={tree[1]}/>;
    case 'lam':
      return <Lam name={tree[1]}>{construct(tree[2])}</Lam>;
    case 'app':
      return <App>
        {construct(tree[1])}
        {construct(tree[2])}
      </App>
    case 'int':
      return <Int body={tree[2]} />
  }
}

export default props => {
  let { className, children, tree } = props;
  return (
    <div className={`${styles.className} ${className}`}>
      {tree ? construct(tree) : null}
    </div>
  );
};
