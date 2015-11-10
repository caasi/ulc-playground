import React from 'react';

import styles from './index.css';

export default props => {
  let { className, children, tree } = props;
  return (
    <div className={`${styles.className} ${className}`}>
      {tree ? JSON.stringify(tree, null, 2) : null}
    </div>
  );
};
