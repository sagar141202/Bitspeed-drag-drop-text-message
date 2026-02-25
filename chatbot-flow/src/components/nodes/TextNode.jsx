import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * TextNode - A custom node component for displaying text messages in the flow builder
 * 
 * Features:
 * - Target handle on the left (can have multiple incoming edges)
 * - Source handle on the right (can only have one outgoing edge - enforced in App.jsx)
 * - Displays the text content of the node
 * 
 * @param {Object} props - Component props
 * @param {Object} props.data - Node data containing the text content
 * @param {boolean} props.selected - Whether the node is currently selected
 */
const TextNode = ({ data, selected }) => {
  return (
    <div 
      className="text-node" 
      style={{ 
        borderColor: selected ? '#4a90d9' : '#dee2e6',
        borderWidth: selected ? '2px' : '1px'
      }}
    >
      {/* Target Handle - Left side (incoming connection) */}
      {/* Target handles can have multiple edges connecting to them */}
      <Handle
        type="target"
        position={Position.Left}
        id="target-handle"
        style={{ 
          background: '#4a90d9',
          width: 10,
          height: 10,
          border: '2px solid white'
        }}
      />
      
      {/* Node Header */}
      <div className="node-header">
        💬 Text Message
      </div>
      
      {/* Node Content - Displays the text or placeholder */}
      <div className="node-content">
        {data?.text ? (
          <span style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {data.text}
          </span>
        ) : (
          <span style={{ color: '#999', fontStyle: 'italic' }}>
            Click to add text...
          </span>
        )}
      </div>
      
      {/* Source Handle - Right side (outgoing connection) */}
      {/* Source handles can only have ONE edge originating from them */}
      <Handle
        type="source"
        position={Position.Right}
        id="source-handle"
        style={{ 
          background: '#4a90d9',
          width: 10,
          height: 10,
          border: '2px solid white'
        }}
      />
    </div>
  );
};

// Memoize for performance optimization
export default memo(TextNode);
