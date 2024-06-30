const nodes = require('./nodes.json');
const edges = require('./edges.json');

// Helper function to find the next nodes connected by an edge
function findNextNodes(sourceId) {
  return edges.filter(edge => edge.source === sourceId).map(edge => edge.target);
}

// Recursive function to construct paths
function constructPaths(currentNode, path = [], branch = null) {
  const newNode = nodes.find(node => node.id === currentNode);
  const newPath = [...path, { id: currentNode, branch }]; // Add the current node to the path with branch information
  const nextNodes = findNextNodes(currentNode); // Find next nodes based on edges

  if (nextNodes.length === 0) {
    // If there are no next nodes, return the current path
    return [newPath];
  }

  // Accumulate paths from all next nodes
  let paths = [];
  nextNodes.forEach(nextNode => {
    const edge = edges.find(edge => edge.source === currentNode && edge.target === nextNode);
    const nextNodeData = nodes.find(node => node.id === nextNode);
    const nextBranch = nextNodeData.data.branch || branch; // Use the current branch or propagate the branch

    const nextPaths = constructPaths(nextNode, newPath, nextBranch);
    paths.push(...nextPaths);
  });

  return paths;
}

// Start constructing paths from the initial node
const initialNodeId = "node_1"; // Assuming `node_1` is the starting point
const paths = constructPaths(initialNodeId);

console.log(paths);
