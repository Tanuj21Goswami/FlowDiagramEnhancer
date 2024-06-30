import React from 'react';
import { Handle } from 'react-flow-renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { useFlow } from '../FlowContext'; // Ensure the correct path

const IconNode = ({ id, data }) => {
  const { deleteNode } = useFlow();

  const handleDelete = () => {
    deleteNode(id);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '25px',
      backgroundColor: '#f9f9f9',
      position: 'relative', // Ensure position relative for absolute positioning of branch label
    }}>
      {/* Handle for incoming connections */}
      <Handle type="target" position="left" />

      {/* Icon */}
      <FontAwesomeIcon icon={faCoffee} />

      {/* Label */}
      <div>{data.label}</div>

      {/* Delete button */}
      <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete</button>

      {/* Handle for outgoing connections */}
      <Handle type="source" position="right" />

      {/* Branch label */}
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
}

export default IconNode;
