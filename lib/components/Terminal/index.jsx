import React from 'react';

import styles from './index.css';

export default props => {
  let { className, children, command, onChange, onSubmit } = props;
  return <div className={`${styles.className} ${className}`}>
    <div className="history">
      {children}
    </div>
    <input
      type="text"
      onChange={onChange}
      onKeyUp={e => { if (e.keyCode === 13) onSubmit(e) }}
      value={command}
    />
  </div>
}
