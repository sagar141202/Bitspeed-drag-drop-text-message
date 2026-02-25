import React, { useCallback, useRef, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import TextNode from './components/nodes/TextNode';
import NodesPanel from './components/NodesPanel';
import SettingsPanel from './components/SettingsPanel';
import SaveButton from './components/SaveButton';
import useFlowStore from './store/flowStore';
import { sourceHasConnection } from './utils/validation';

// Define custom node types
// This makes the flow builder extensible - new node types can be added here
const nodeTypes = {
  textNode: TextNode,
  // Future node types can be added:
  // imageNode: ImageNode,
  // buttonNode: ButtonNode,
};

/**
 * Main FlowBuilder component
 * 
 * This is the core component that integrates React Flow with our custom components.
 * It handles:
 * - Drag and drop from nodes panel
 * - Node selection and settings
 * - Edge connections with rules
 * - Save functionality
 */
const FlowBuilder = () => {
  const reactFlowWrapper = useRef(null);
  
  // Local state for React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  // Get store actions
  const { 
    selectedNode, 
    selectNode, 
    setNodes: setStoreNodes, 
    setEdges: setStoreEdges,
    clearMessage 
  } = useFlowStore();
  
  // Store sync - keep local state in sync with store
  // This ensures the store has the latest state
  const syncToStore = useCallback(() => {
    setStoreNodes(nodes);
    setStoreEdges(edges);
  }, [nodes, edges, setStoreNodes, setStoreEdges]);
  
  // Update store when nodes/edges change
  useEffect(() => {
    syncToStore();
  }, [nodes, edges, syncToStore]);

  // Sync node data changes from store back to React Flow
  // This ensures that when SettingsPanel updates a node, it reflects in the flow
  useEffect(() => {
    if (selectedNode && nodes.length > 0) {
      // Find the current node in React Flow's state
      const currentNode = nodes.find((n) => n.id === selectedNode.id);
      // Update if found and data is different
      if (currentNode && currentNode.data.text !== selectedNode.data.text) {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === selectedNode.id
              ? { ...node, data: { ...node.data, text: selectedNode.data.text } }
              : node
          )
        );
      }
    }
  }, [selectedNode, setNodes, nodes]);

  /**
   * Handle connection between nodes
   * 
   * Rules:
   * - Source handle can only have ONE outgoing edge
   * - Target handle can have multiple incoming edges
   */
  const onConnect = useCallback((params) => {
    // Check if source already has a connection
    // If so, don't allow another connection from the same source
    if (sourceHasConnection(params.source, edges)) {
      alert('Source handle can only have one connection!');
      return;
    }
    
    // Add the edge with smooth step style
    setEdges((eds) => addEdge(
      { 
        ...params, 
        type: ConnectionLineType.SmoothStep,
        animated: true,
        style: { stroke: '#4a90d9', strokeWidth: 2 }
      }, 
      eds
    ));
  }, [edges, setEdges]);

  /**
   * Handle drag over event - allows dropping
   */
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handle drop event - creates new node
   */
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // Check if valid node type
      if (!type || !nodeTypes[type]) {
        return;
      }

      // Get position from react flow instance
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create new node with unique ID
      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { 
          // Default text for new nodes
          text: '' 
        },
      };

      // Add node to state
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  /**
   * Handle node click - select node for editing
   */
  const onNodeClick = useCallback((event, node) => {
    selectNode(node);
    clearMessage();
  }, [selectNode, clearMessage]);

  /**
   * Handle pane click - clear selection when clicking on empty area
   */
  const onPaneClick = useCallback(() => {
    selectNode(null);
    clearMessage();
  }, [selectNode, clearMessage]);

  /**
   * Handle edge click - delete edge when clicked
   * Allows user to undo/remove connections
   */
  const onEdgeClick = useCallback((event, edge) => {
    // Remove the edge from the edges array
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges]);

  // Memoize the style object for better performance
  const reactFlowStyle = useMemo(() => ({
    background: '#f8f9fa'
  }), []);

  return (
    <div className="app-container">
      {/* Sidebar with Nodes Panel or Settings Panel */}
      <div className="sidebar">
        {selectedNode ? (
          <SettingsPanel />
        ) : (
          <NodesPanel />
        )}
        <SaveButton />
      </div>

      {/* React Flow Canvas */}
      <div className="react-flow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          style={reactFlowStyle}
          // Connection line settings
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{ stroke: '#4a90d9', strokeWidth: 2 }}
          // Enable these features for better UX
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          {/* Control buttons */}
          <Controls />
          
          {/* Mini map for overview */}
          <MiniMap 
            nodeStrokeWidth={3}
            zoomable
            pannable
          />
          
          {/* Background grid */}
          <Background 
            variant="dots" 
            gap={15} 
            size={1} 
            color="#dee2e6"
          />
        </ReactFlow>
      </div>
    </div>
  );
};

// Wrap with ReactFlowProvider for context
export default function App() {
  return (
    <ReactFlowProvider>
      <FlowBuilder />
    </ReactFlowProvider>
  );
}
