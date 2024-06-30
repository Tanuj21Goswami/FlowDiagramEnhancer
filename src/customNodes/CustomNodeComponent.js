import React from 'react';
import { Handle } from 'react-flow-renderer';

const CustomNodeComponent = ({ data }) => (
  <div style={{ padding: 10, backgroundColor: '#ddd', border: '1px solid #ccc', position: 'relative' }}>
    {/* Display label */}
    {data.label}

    {/* Handles for connections */}
    <Handle type="target" position="top" style={{ borderRadius: 0 }} />
    <Handle type="source" position="bottom" style={{ borderRadius: 0 }} />

    {/* Display branch label if present */}
    {data.branch && (
      <span style={{
        position: 'absolute',
        top: '-20px', // Adjust positioning as needed
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#888',
      }}>
        {`Branch: ${data.branch}`}
      </span>
    )}
  </div>
);

export default CustomNodeComponent;
