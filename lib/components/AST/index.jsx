import React from 'react';

export default props => {
  let { className, children, tree } = props;
  return (
    <div className={`ast ${className}`}>
      {JSON.stringify(tree, null, 2)}
    </div>
  );
};
