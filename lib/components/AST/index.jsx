import React from 'react';

export default props => {
  let { className, children, tree } = props;
  return (
    <div className={`ast ${className}`}>
      {tree ? JSON.stringify(tree, null, 2) : null}
    </div>
  );
};
