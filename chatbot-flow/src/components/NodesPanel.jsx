import React from 'react';
import { getAvailableNodeTypes } from '../utils/validation';

/**
 * NodesPanel - Sidebar component that displays available node types
 * 
 * This panel is designed to be extensible - new node types can be added
 * by updating the getAvailableNodeTypes() function in validation.js
 * 
 * Features:
 * - Displays all available node types
 * - Implements drag and drop functionality
 * - Each node type shows an icon and label
 */
const NodesPanel = () => {
  const nodeTypes = getAvailableNodeTypes();

  /**
   * Called when user starts dragging a node from the panel
   * Sets the data transfer to identify the node type being dragged
   */
  const onDragStart = (event, nodeType) => {
    // Store the node type in dataTransfer for use during drop
    event.dataTransfer.setData('application/reactflow', nodeType.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="nodes-panel">
      <h3>📋 Nodes Panel</h3>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
        Drag nodes to the canvas to build your flow
      </p>
      
      {/* Render each available node type */}
      {nodeTypes.map((nodeType) => (
        <div
          key={nodeType.type}
          className="draggable-node"
          draggable
          onDragStart={(e) => onDragStart(e, nodeType)}
          title={nodeType.description}
          style={{
            marginBottom: '8px',
            cursor: 'grab'
          }}
        >
          <span style={{ fontSize: '20px', marginRight: '8px' }}>
            {nodeType.icon}
          </span>
          <div>
            <div style={{ fontWeight: '500', fontSize: '14px' }}>
              {nodeType.label}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {nodeType.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NodesPanel;
