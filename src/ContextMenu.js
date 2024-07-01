// ContextMenu.js

import React from 'react';

const ContextMenu = ({ x, y, onClose, onOptionSelected }) => {
  const handleClick = (option) => {
    onOptionSelected(option);
    onClose();
  };

  return (
    <div style={{ position: 'absolute', left: x, top: y, background: '#fff', border: '1px solid #ccc', padding: '5px' }}>
      <div onClick={() => handleClick('Option 1')}>Option 1</div>
      <div onClick={() => handleClick('Option 2')}>Option 2</div>
      <div onClick={() => handleClick('Option 3')}>Option 3</div>
    </div>
  );
};

export default ContextMenu;
