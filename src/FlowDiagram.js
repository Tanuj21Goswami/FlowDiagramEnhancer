import React, { useCallback, useRef } from 'react';
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer';
import { useFlow } from './FlowContext';
import ImageNode from './customNodes/ImageNode';
import CircularNode from './customNodes/CircularNode';
import CustomNodeComponent from './customNodes/CustomNodeComponent';
import IconNode from './customNodes/IconNode';
import myImage from './logo_1.png';

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
    const updatedNodes = nodes.map(node => {
      const branch = node.data?.branch;
      if (!branch || !branchNodes[branch]) return node;
      
      const nodesInBranch = branchNodes[branch];
      const spacing = 150; // Customize this spacing value as needed
      const startX = 100; // Starting X position for the first node in the branch
      const startY = 100; // Starting Y position for the first node in the branch

      const nodeIndex = nodesInBranch.indexOf(node);
      return {
        ...node,
        position: {
          x: startX + nodeIndex * spacing,
          y: startY + nodeIndex * spacing
        }
      };
    });

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

  const nodeTypes = {
    customNodeType: CustomNodeComponent,
    circular: CircularNode,
    imageNode: ImageNode,
    iconNode: IconNode,
  };
  

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ justifyContent: 'space-evenly', padding: '10px' }}>
        <button onClick={equispaceParallelNodes}>Equispace Parallel Nodes</button>
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