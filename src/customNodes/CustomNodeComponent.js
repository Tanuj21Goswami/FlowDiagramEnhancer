import React from 'react';
import { Handle } from 'react-flow-renderer';

const CustomNodeComponent = ({ data }) => {
  const isParallelEnd = data.parallelEnd;

  return (
    <div style={{
      padding: 10,
      backgroundColor: '#fff',
      border: '2px solid #888',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
      position: 'relative',
      width: '150px',
      textAlign: 'center'
    }}>
      {/* Display label */}
      <strong>{data.label}</strong>

      {/* Handles for connections */}
      <Handle type="target" position="top" style={{ borderRadius: 0 }} />
      <Handle type="source" position="bottom" style={{ borderRadius: 0 }} />

      {/* Display branch label if present */}
      {data.branch && (
        <span style={{
          position: 'absolute',
          top: '-20px',
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#888',
        }}>
          {`Branch: ${data.branch}`}
        </span>
      )}

      {/* Display "Parallel End" tag if it's the last node of a parallel branch */}
      {isParallelEnd && (
        <span style={{
          position: 'absolute',
          bottom: '-20px',
          fontSize: '10px',
          color: '#888',
        }}>
          Parallel End
        </span>
      )}
    </div>
  );
};

export default CustomNodeComponent;
