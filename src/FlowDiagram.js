import { useEffect } from 'react';
import React, { useCallback, useRef } from 'react';
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { useFlow } from './FlowContext';
import { debounce } from 'lodash';

import ImageNode from './customNodes/ImageNode';
import CircularNode from './customNodes/CircularNode';
import CustomNodeComponent from './customNodes/CustomNodeComponent';
import IconNode from './customNodes/IconNode';
import myImage from './logo_1.png';
import './FlowDiagram.css';

const FlowDiagram = () => {
  const {
    nodes, edges, setNodes, setEdges, history, currentHistoryIndex,
    setHistory, setCurrentHistoryIndex
  } = useFlow();
  const reactFlowWrapper = useRef(null);
  const nodeIdRef = useRef(nodes.length + 1);

  const pushToHistory = useCallback((newNodes, newEdges) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [history, currentHistoryIndex, setHistory, setCurrentHistoryIndex]);

  const addNode = useCallback((type) => {
    const branchNumber = prompt(`Enter branch number for ${type} node:`); // Example prompt, replace with your UI logic
  
    if (branchNumber) {
      let newNode = {
        id: `node_${nodeIdRef.current++}`,
        type,
        position: { x: Math.random() * window.innerWidth * 0.5, y: Math.random() * window.innerHeight * 0.5 },
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node ${nodeIdRef.current}`,
          branch: `branch_${branchNumber}`
        }
      };
  
      // Check if it's the last node of the branch
      const branchNodes = nodes.filter(node => node.data?.branch === newNode.data.branch);
      if (branchNodes.length === 0 || branchNodes[branchNodes.length - 1].id === newNode.id) {
        newNode.data.parallelEnd = true;
      } else {
        newNode.data.parallelEnd = false;
      }
  
      if (type === 'imageNode') {
        newNode.data.imageUrl = myImage;
      }
  
      const newNodes = [...nodes, newNode];
      pushToHistory(newNodes, edges);
      setNodes(newNodes);
    }
  }, [nodes, edges, pushToHistory, setNodes]);
  
  
  

  const equispaceParallelNodes = useCallback(() => {
    const branchNodes = {};
  
    // Group nodes by branch
    nodes.forEach(node => {
      const branch = node.data?.branch;
      if (branch) {
        if (!branchNodes[branch]) {
          branchNodes[branch] = [];
        }
        branchNodes[branch].push(node);
      }
    });
  
    // Calculate new positions
    const branchSpacingX = 500; // Increase this value to increase horizontal spacing between branches
    const branchSpacingY = 500; // Increase this value to increase vertical spacing between branches
    const nodeSpacing = 150; // Spacing between nodes within the same branch
  
    let branchIndex = 0;
  
    const updatedNodes = Object.keys(branchNodes).flatMap((branch, index) => {
      const nodesInBranch = branchNodes[branch];
      const startX = 100 + (branchIndex % 3) * branchSpacingX; // Starting X position for each branch
      const startY = 100 + Math.floor(branchIndex / 3) * branchSpacingY; // Starting Y position for each branch
      branchIndex += 1;
  
      return nodesInBranch.map((node, nodeIndex) => ({
        ...node,
        position: {
          x: startX + nodeIndex * nodeSpacing,
          y: startY
        }
      }));
    });
  
    // Label the last node in each branch with a unique branch ID and "Parallel End"
    const branchEndNodes = {};
    updatedNodes.forEach(node => {
      const branch = node.data?.branch;
      if (branch && branchNodes[branch] && node === branchNodes[branch][branchNodes[branch].length - 1]) {
        branchEndNodes[node.id] = {
          ...node,
          data: {
            ...node.data,
            label: `${node.data.label} (${branch})`,
            parallelEnd: true
          }
        };
      }
    });
  
    // Merge branch end nodes into updated nodes
    const finalNodes = updatedNodes.map(node => {
      if (branchEndNodes[node.id]) {
        return branchEndNodes[node.id];
      }
      return node;
    });
  
    pushToHistory(finalNodes, edges);
    setNodes(finalNodes);
  }, [nodes, edges, pushToHistory, setNodes]);
  

  // Example function to handle node deletion
const deleteNode = useCallback((nodeId) => {
  const updatedNodes = nodes.filter(node => node.id !== nodeId);
  
  // Check if the deleted node was marked as parallelEnd
  const index = updatedNodes.findIndex(node => node.id === nodeId);
  if (index > 0 && updatedNodes[index - 1].data?.branch === updatedNodes[index].data?.branch) {
    updatedNodes[index - 1] = {
      ...updatedNodes[index - 1],
      data: {
        ...updatedNodes[index - 1].data,
        parallelEnd: true,
      },
    };
  }
  
  // Update state and history
  pushToHistory(updatedNodes, edges);
  setNodes(updatedNodes);
}, [nodes, edges, pushToHistory, setNodes]);

  

  const onConnect = useCallback((params) => {
    const { source, target } = params;
    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);
  
    let updatedNodes = [...nodes]; // Clone the current nodes array
  
    // Check if the source node and target node have the same branch
    if (sourceNode.data.branch === targetNode.data.branch) {
      // Proceed with adding the edge if the connection is valid
      setEdges(eds => [...eds, { id: `e${source}-${target}`, ...params }]);
    } else {
      console.log('Cannot connect nodes from different branches.');
    }
  }, [nodes, edges, setEdges]);
  

  const onConnect1 = useCallback((params) => {
    const { source, target } = params;
    const sourceNode = nodes.find((n) => n.id === source);
    const targetNode = nodes.find((n) => n.id === target);
  
    if (sourceNode.type === 'circular' || sourceNode.data.branch) {
      const branchName = sourceNode.type === 'circular' ? `branch_${source}` : sourceNode.data.branch;
  
      const updatedNodes = nodes.map(node => {
        if (node.id === target) {
          return {
            ...node,
            data: {
              ...node.data,
              branch: branchName,
            },
          };
        }
        return node;
      });
  
      setNodes(updatedNodes);
    }
  
    // Proceed with additional logic (e.g., prevent invalid connections, mark end of branches)
    setEdges((eds) => [...eds, { id: `e${params.source}-${params.target}`, ...params }]);
  }, [nodes, edges, setEdges, setNodes]);
  

const onNodeDragStop = useCallback(debounce((event, node) => {
  const newNodes = nodes.map((nd) => {
    if (nd.id === node.id) {
      return {
        ...nd,
        position: node.position,
      };
    }
    return nd;
  });
  pushToHistory(newNodes, edges);
  setNodes(newNodes);
}, 300), [nodes, edges, pushToHistory]); // Adjust the debounce delay (300ms) as needed


  const makeNodesEquispacedAndCentered = useCallback(() => {
    if (!reactFlowWrapper.current) return;
    const spacing = 100; // Vertical spacing between nodes
    const containerWidth = reactFlowWrapper.current.offsetWidth;
    const centerX = containerWidth / 2;
    const updatedNodes = nodes.map((node, index) => ({
      ...node,
      position: { x: centerX - 50, y: index * spacing + 100 }
    }));
    pushToHistory(updatedNodes, edges);
    setNodes(updatedNodes);
    console.log(updatedNodes);
  }, [nodes, edges, pushToHistory]);


  
  
  const undo = useCallback(() => {
    if (currentHistoryIndex === 0) return;
    const newIndex = currentHistoryIndex - 1;
    const prevState = history[newIndex];
    setCurrentHistoryIndex(newIndex);
    setNodes(prevState.nodes);
    setEdges(prevState.edges);
  }, [history, currentHistoryIndex]);
  
  const redo = useCallback(() => {
    if (currentHistoryIndex >= history.length - 1) return;
    const newIndex = currentHistoryIndex + 1;
    const nextState = history[newIndex];
    setCurrentHistoryIndex(newIndex);
    setNodes(nextState.nodes);
    setEdges(nextState.edges);
  }, [history, currentHistoryIndex]);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        undo();
      } else if (event.ctrlKey && event.key === 'y') {
        redo();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);
  const nodeTypes = {
    customNodeType: CustomNodeComponent,
    circular: CircularNode,
    imageNode: ImageNode,
    iconNode: IconNode,
  };
  

  return (
    <div className="flow-diagram-container">
      <div className="controls-container">
        <button className="action-button" onClick={equispaceParallelNodes}>Equispace Parallel Nodes</button>
        <div className="undo-redo">
          <button className="control-button" onClick={undo}>Undo</button>
          <button className="control-button" onClick={redo}>Redo</button>
        </div>
      </div>
      <div className="node-buttons">
        <button className="node-button" onClick={() => addNode('circular')}>Add Circular Node</button>
        <button className="node-button" onClick={() => addNode('iconNode')}>Add ICON Node</button>
        <button className="node-button" onClick={() => addNode('imageNode')}>Add Image Node</button>
        <button className="node-button" onClick={() => addNode('default')}>Add Default Node</button>
      </div>
      <div className="flow-diagram" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onNodeDragStop={onNodeDragStop}
        >
          <MiniMap
            nodeColor={node => {
              switch (node.type) {
                case 'input': return 'red';
                case 'output': return 'blue';
                case 'default': return 'gray';
                default: return '#00ff00';
              }
            }}
            nodeStrokeWidth={3}
          />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowDiagram;