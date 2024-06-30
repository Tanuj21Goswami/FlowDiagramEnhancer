import React from 'react';
import { Handle } from 'react-flow-renderer';
import { useFlow } from '../FlowContext'; // Ensure the correct path
import myImage from '../logo_1.png'; // Update the path accordingly

const CircularNode = ({ id, data }) => {
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
      width: '120px',
      height: '120px',
      backgroundColor: '#D6D5E6',
      borderRadius: '50%', // Makes the div circular
      border: '2px solid #333',
      position: 'relative',
    }}>
      {/* Display the image */}
      <img src={myImage} alt="" style={{ width: '50px', height: '50px' }} />

      {/* Display handles for connections */}
      <Handle type="target" position="top" />
      <Handle type="source" position="bottom" />

      {/* Display branch label if present in data */}
      {data.branch && (
        <span style={{
          position: 'absolute',
          bottom: '-20px', // Adjust positioning as needed
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#888',
        }}>
          {`Branch: ${data.branch}`}
        </span>
      )}

      {/* Display delete button */}
      <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete</button>
    </div>
  );
};

export default CircularNode;
