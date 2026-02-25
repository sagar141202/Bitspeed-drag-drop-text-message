import React from 'react';
import useFlowStore from '../store/flowStore';
import { validateFlow } from '../utils/validation';

/**
 * SaveButton - Button to save the flow with validation
 * 
 * Validation Rules:
 * - If there are no nodes, show error
 * - If there's only one node, it's valid
 * - If there are more than one node, all must have connected target handles
 *   (i.e., not more than one node can be disconnected)
 * 
 * On successful save, it logs the flow data to console (simulating API call)
 */
const SaveButton = () => {
  // Get state from store
  const { nodes, edges, setMessage, message } = useFlowStore();
  
  /**
   * Handle save button click
   * Validates the flow before saving
   */
  const handleSave = () => {
    // Validate the flow
    const validationResult = validateFlow(nodes, edges);
    
    if (!validationResult.valid) {
      // Show error message
      setMessage({ type: 'error', text: validationResult.error });
      return;
    }
    
    // Flow is valid - prepare the flow data
    const flowData = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      })),
      metadata: {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        savedAt: new Date().toISOString()
      }
    };
    
    // Log the flow data (in production, this would be an API call)
    console.log('Flow saved successfully!', flowData);
    
    // Show success message
    setMessage({ 
      type: 'success', 
      text: `Flow saved successfully! (${nodes.length} nodes, ${edges.length} connections)`
    });
  };
  
  return (
    <div style={{ marginTop: 'auto' }}>
      <button
        onClick={handleSave}
        className="save-button"
        style={{ width: '100%' }}
      >
        💾 Save Flow
      </button>
      
      {/* Display message if exists */}
      {message && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default SaveButton;
