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
 * On successful save, it downloads the flow data as a JSON file
 */
const SaveButton = () => {
  // Get state from store
  const { nodes, edges, addToast } = useFlowStore();
  
  /**
   * Download flow data as JSON file
   */
  const downloadFlow = (flowData) => {
    const jsonString = JSON.stringify(flowData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create temporary link to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `chatbot-flow-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  };
  
  /**
   * Handle save button click
   * Validates the flow before saving
   */
  const handleSave = () => {
    // Validate the flow
    const validationResult = validateFlow(nodes, edges);
    
    if (!validationResult.valid) {
      // Show error toast
      addToast(validationResult.error, 'error');
      return;
    }
    
    // Flow is valid - prepare the flow data
    const flowData = {
      flow: {
        name: 'Chatbot Flow',
        description: 'Flow saved from Chatbot Flow Builder'
      },
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: {
          x: node.position.x,
          y: node.position.y
        },
        data: {
          text: node.data?.text || ''
        }
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
        savedAt: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    // Download the flow data as JSON
    downloadFlow(flowData);
    
    // Show success toast
    addToast(`Flow saved successfully! (${nodes.length} nodes, ${edges.length} connections)`, 'success');
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
    </div>
  );
};

export default SaveButton;

