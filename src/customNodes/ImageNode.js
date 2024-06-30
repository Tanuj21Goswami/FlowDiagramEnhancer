// customNodes/ImageNode.js
import React from 'react';
import { Handle } from 'react-flow-renderer';
import { useFlow } from '../FlowContext'; // Ensure the correct path
import myImage from '../logo_1.png'; // Update the path accordingly

const ImageNode = ({ id, data }) => {
  const { deleteNode } = useFlow();

  const handleDelete = () => {
    deleteNode(id);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      backgroundColor: '#f9f9f9',
      position: 'relative', // Ensure position relative for absolute positioning of branch label
    }}>
      {/* Handle for incoming connections */}
      <Handle type="target" position="top" />

      {/* Image */}
      <img src={myImage} alt="" style={{ width: '50px', height: '50px' }} />

      {/* Label */}
      <div>{data.label}</div>

      {/* Handle for outgoing connections */}
      <Handle type="source" position="bottom" />

      {/* Delete button */}
      <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete</button>

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
};

export default ImageNode;
