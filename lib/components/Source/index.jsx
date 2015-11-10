import React from 'react';

import styles from './index.css';

export default props => {
  let { className, children, value, onChange } = props;
  return (
    <div className={`${styles.className} ${className}`}>
      <textarea value={value} onChange={onChange} />
    </div>
  );
};
