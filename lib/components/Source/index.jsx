import React from 'react';

export default props => {
  let { className, children, value, onChange } = props;
  return (
    <div className={`source ${className}`}>
      <input type="textarea" value={value} onChange={onChange} />
    </div>
  );
};
