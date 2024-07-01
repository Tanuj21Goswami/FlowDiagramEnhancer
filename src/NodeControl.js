// NodeControl.jsx
import React, { useState } from 'react';
import { useFlow } from './FlowContext';
import './NodeControl.css'; // Import the CSS file

const NodeControl = () => {
  const { addNode, deleteNode, nodes } = useFlow();
  const [nodeIdToDelete, setNodeIdToDelete] = useState('');

  const handleAddNode = () => {
    // Example logic: Check if adding the node would violate branch restrictions
    const newNode = {
      id: `node_${Date.now()}`,
      data: {
        label: `New Node`,
        branch: 'branch_example' // Adjust with your actual branch logic
      },
      position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }
    };

    // Example logic: Check if nodes with the same branch already exist
    const nodesWithSameBranch = nodes.filter(node => node.data.branch === newNode.data.branch);

    if (nodesWithSameBranch.length > 0) {
      console.log('Cannot add node: Branch restriction violated.');
      // Optionally provide user feedback here
      return;
    }

    // Add node if branch restrictions are satisfied
    addNode(newNode);
  };

  const handleDeleteNode = () => {
    deleteNode(nodeIdToDelete);
    setNodeIdToDelete(''); // Clear the input after deletion
  };

  return (
    <div className="node-control-container">
      <button onClick={handleAddNode}>Add Node</button>
      <input
        type="text"
        value={nodeIdToDelete}
        onChange={(e) => setNodeIdToDelete(e.target.value)}
        placeholder="Node ID to delete"
      />
      <button onClick={handleDeleteNode}>Delete Node</button>
    </div>
  );
};

export default NodeControl;
