import React, { useState, useEffect } from 'react';
import useFlowStore from '../store/flowStore';

/**
 * SettingsPanel - Panel for editing the selected node's properties
 * 
 * This panel appears when a node is selected and replaces the NodesPanel
 * Currently supports editing text content for Text Nodes
 * 
 * Features:
 * - Text input for editing node content
 * - Shows node type information
 * - Clear button to reset selection
 */
const SettingsPanel = () => {
  // Get state and actions from the store
  const { selectedNode, updateNodeData, clearSelection } = useFlowStore();
  
  // Local state for the text input
  const [text, setText] = useState('');
  
  // Update local state when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setText(selectedNode.data?.text || '');
    }
  }, [selectedNode]);
  
  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    // Update the node data in the store
    if (selectedNode) {
      updateNodeData(selectedNode.id, { text: newText });
    }
  };
  
  // Handle clear selection
  const handleClearSelection = () => {
    clearSelection();
  };
  
  // If no node is selected, don't render anything
  if (!selectedNode) {
    return null;
  }
  
  return (
    <div className="settings-panel">
      <h3>⚙️ Settings Panel</h3>
      
      {/* Node Type Display */}
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Node Type
        </div>
        <div style={{ fontWeight: '500' }}>
          {selectedNode.type === 'textNode' ? '💬 Text Message' : selectedNode.type}
        </div>
      </div>
      
      {/* Text Input - Only for text nodes */}
      {selectedNode.type === 'textNode' && (
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="text-input" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Message Text
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your message text..."
            rows={5}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #dee2e6',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {text.length} characters
          </div>
        </div>
      )}
      
      {/* Node ID Display */}
      <div style={{ marginBottom: '16px', padding: '12px', background: '#f8f9fa', borderRadius: '6px' }}>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
          Node ID
        </div>
        <div style={{ fontSize: '12px', wordBreak: 'break-all' }}>
          {selectedNode.id}
        </div>
      </div>
      
      {/* Clear Selection Button */}
      <button
        onClick={handleClearSelection}
        style={{
          width: '100%',
          padding: '10px',
          background: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}
      >
        Clear Selection
      </button>
    </div>
  );
};

export default SettingsPanel;
