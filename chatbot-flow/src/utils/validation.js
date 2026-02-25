/**
 * Validation utilities for the chatbot flow builder
 */

/**
 * Check if a node has a connected target handle
 * @param {string} nodeId - The ID of the node to check
 * @param {Array} edges - Array of edge objects
 * @returns {boolean} - True if the node has a connected target handle
 */
export const hasTargetHandle = (nodeId, edges) => {
  return edges.some((edge) => edge.target === nodeId);
};

/**
 * Check if a node has a connected source handle
 * @param {string} nodeId - The ID of the node to check
 * @param {Array} edges - Array of edge objects
 * @returns {boolean} - True if the node has a connected source handle
 */
export const hasSourceHandle = (nodeId, edges) => {
  return edges.some((edge) => edge.source === nodeId);
};

/**
 * Validate the flow before saving
 * Rule: If there are more than one node, there should not be more than one node 
 * with empty target handles (disconnected from incoming edges)
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} - Validation result with valid status and error message if invalid
 */
export const validateFlow = (nodes, edges) => {
  // If no nodes, flow is empty (not necessarily invalid, but there's nothing to save)
  if (nodes.length === 0) {
    return { valid: false, error: 'No nodes in the flow to save.' };
  }
  
  // If single node, flow is valid
  if (nodes.length === 1) {
    return { valid: true };
  }
  
  // Find nodes without target handles connected
  const disconnectedNodes = nodes.filter((node) => !hasTargetHandle(node.id, edges));
  
  // If more than one node has empty target handles, it's invalid
  if (disconnectedNodes.length > 1) {
    return { 
      valid: false, 
      error: `${disconnectedNodes.length} nodes have empty target handles. Please connect all nodes before saving.`,
      disconnectedNodes: disconnectedNodes.map(n => n.id)
    };
  }
  
  return { valid: true };
};

/**
 * Check if a source handle already has a connection
 * @param {string} sourceId - The source node ID
 * @param {Array} edges - Array of edge objects
 * @returns {boolean} - True if the source already has a connection
 */
export const sourceHasConnection = (sourceId, edges) => {
  return edges.some((edge) => edge.source === sourceId);
};

/**
 * Get all node types that are available in the builder
 * This makes it easy to extend with new node types in the future
 * @returns {Array} - Array of available node types
 */
export const getAvailableNodeTypes = () => {
  return [
    {
      type: 'textNode',
      label: 'Message Node',
      icon: '💬',
      description: 'A text message node'
    }
    // Future node types can be added here:
    // { type: 'imageNode', label: 'Image Node', icon: '🖼️', description: 'An image message node' },
    // { type: 'buttonNode', label: 'Button Node', icon: '🔘', description: 'A button for user input' },
  ];
};
