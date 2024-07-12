import React, { useCallback, useRef } from 'react';
import ReactFlow from 'react-flow-renderer';
import { MiniMap, Controls } from 'react-flow-renderer';

import { useFlow } from './FlowContext';
import ImageNode from './customNodes/ImageNode';
import CircularNode from './customNodes/CircularNode';
import CustomNodeComponent from './customNodes/CustomNodeComponent';
import IconNode from './customNodes/IconNode';
import myImage from './logo_1.png';

const FlowDiagram = () => {
  const { nodes, edges, setNodes, setEdges, history, currentHistoryIndex, setHistory, setCurrentHistoryIndex } = useFlow();
  const reactFlowWrapper = useRef(null);
  const nodeIdRef = useRef(nodes.length + 1);

  const pushToHistory = useCallback((newNodes, newEdges) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  }, [history, currentHistoryIndex]);

  const addNode = useCallback((type) => {
    let newNode = {
      id: `node_${nodeIdRef.current++}`,
      type,
      position: { x: Math.random() * window.innerWidth * 0.5, y: Math.random() * window.innerHeight * 0.5 },
      data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node ${nodeIdRef.current}`, level: 1 } // Default level 1 for new nodes
    };

    if (type === 'imageNode') {
      newNode.data.imageUrl = myImage;
    }

    const newNodes = [...nodes, newNode];
    pushToHistory(newNodes, edges);
    setNodes(newNodes);
  }, [nodes, edges, pushToHistory]);

  const onConnect = useCallback((params) => {
    const { source, target } = params;
    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);
  
    if (sourceNode && targetNode) {
      if (shouldPreventConnection(sourceNode, targetNode)) {
        console.error("Invalid connection between parallel branches.");
        return;
      }
  
      const newLevel = (sourceNode.data.level || 1) + 1;
  
      let updatedNodes = nodes.map(node => {
        if (node.id === target) {
          return {
            ...node,
            data: {
              ...node.data,
              level: newLevel
            }
          };
        }
        return node;
      });
  
      // Maintain branches
      let branchName = sourceNode.data.branch || `branch_${source}`;
      updatedNodes = updatedNodes.map(node => {
        if (node.id === source || node.id === target) {
          return {
            ...node,
            data: {
              ...node.data,
              branch: branchName
            }
          };
        }
        return node;
      });
  
      // Label the end of parallel branches
      if (targetNode.type === 'circular') {
        updatedNodes = updatedNodes.map(node => {
          if (node.id === source) {
            return {
              ...node,
              data: {
                ...node.data,
                label: `${node.data.label} - Parallel End`
              }
            };
          }
          return node;
        });
      }
  
      setNodes(updatedNodes);
      setEdges(eds => [...eds, { id: `e${source}-${target}`, ...params }]);
    }
  }, [nodes, setNodes, setEdges]);
  

  const shouldPreventConnection = (sourceNode, targetNode) => {
    const sourceBranch = sourceNode.data.branch;
    const targetBranch = targetNode.data.branch;
  
    // Check if both branches are defined before comparing them
    if (sourceBranch && targetBranch && sourceBranch !== targetBranch) {
      alert(`Cannot connect nodes from different branches: ${sourceBranch} to ${targetBranch}`);
      return true; // Prevents connecting nodes from different branches
    }
  
    return false; // Allow connections within the same branch or if no branch is defined
  };
  

  const onNodeDragStop = useCallback((event, node) => {
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
  }, [nodes, edges, pushToHistory]);

  const makeNodesEquispacedAndCentered = useCallback(() => {
    if (!reactFlowWrapper.current) return;
  
    const verticalSpacing = 300; // Vertical spacing between levels
    const horizontalSpacing = 300; // Minimum horizontal spacing between nodes within the same level
    const containerWidth = reactFlowWrapper.current.offsetWidth;
  
    // Group nodes by levels
    const levelMap = nodes.reduce((acc, node) => {
      const level = node.data.level || 1;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(node);
      return acc;
    }, {});
  
    // Calculate positions for each level
    const updatedNodes = Object.keys(levelMap).flatMap(level => {
      const nodesAtLevel = levelMap[level];
      const numNodes = nodesAtLevel.length;
      const totalWidth = (numNodes - 1) * horizontalSpacing;
      const startX = (containerWidth - totalWidth) / 2; // Center nodes at this level
  
      return nodesAtLevel.map((node, index) => ({
        ...node,
        position: { x: startX + index * horizontalSpacing, y: (level - 1) * verticalSpacing + 100 }
      }));
    });
  
    pushToHistory(updatedNodes, edges);
    setNodes(updatedNodes);
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

  const nodeTypes = {
    customNodeType: CustomNodeComponent,
    circular: CircularNode,
    imageNode: ImageNode,
    iconNode: IconNode,
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ justifyContent: 'space-evenly', padding: '10px' }}>
        <button onClick={makeNodesEquispacedAndCentered}>Equispace Nodes</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={() => addNode('circular')}>Add Circular Node</button>
        <button onClick={() => addNode('iconNode')}>Add ICON Node</button>
        <button onClick={() => addNode('imageNode')}>Add Image Node</button>
        <button onClick={() => addNode('default')}>Add Default Node</button>
      </div>
      <div ref={reactFlowWrapper} style={{ height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeDragStop={onNodeDragStop}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowDiagram;
