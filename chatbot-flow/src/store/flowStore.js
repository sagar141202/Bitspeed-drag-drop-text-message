import { create } from 'zustand';

/**
 * Flow Store - Manages the state of the chatbot flow builder
 * Uses Zustand for clean and simple state management
 */
let toastId = 0;

const useFlowStore = create((set, get) => ({
  // Nodes in the flow
  nodes: [],
  
  // Edges (connections) between nodes
  edges: [],
  
  // Currently selected node
  selectedNode: null,
  
  // Message to show to user (success/error)
  message: null,
  
  // Toast notifications
  toasts: [],
  
  // Set nodes
  setNodes: (nodes) => set({ nodes }),
  
  // Set edges
  setEdges: (edges) => set({ edges }),
  
  // Add a new node to the flow
  addNode: (node) => set((state) => ({ 
    nodes: [...state.nodes, node] 
  })),
  
  // Update a node's data
  updateNodeData: (nodeId, data) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...data } }
        : node
    ),
    // Update selected node if it's the one being edited
    selectedNode: state.selectedNode?.id === nodeId 
      ? { ...state.selectedNode, data: { ...state.selectedNode.data, ...data } }
      : state.selectedNode
  })),
  
  // Select a node
  selectNode: (node) => set({ selectedNode: node, message: null }),
  
  // Clear selection
  clearSelection: () => set({ selectedNode: null, message: null }),
  
  // Set message
  setMessage: (message) => set({ message }),
  
  // Clear message
  clearMessage: () => set({ message: null }),
  
  // Toast methods
  addToast: (message, type = 'success') => {
    const id = ++toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    return id;
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id)
    }));
  },
  
  /**
   * Validate the flow before saving
   * Rule: If there are more than one node, all nodes must have a target handle connected
   * (i.e., all nodes except possibly the first one should have incoming edges)
   */
  validateFlow: () => {
    const { nodes, edges } = get();
    
    // If no nodes or single node, flow is valid
    if (nodes.length <= 1) {
      return { valid: true };
    }
    
    // Find nodes that don't have a target handle connected
    const nodesWithoutTarget = nodes.filter((node) => {
      return !edges.some((edge) => edge.target === node.id);
    });
    
    // If more than one node has empty target handles, it's invalid
    if (nodesWithoutTarget.length > 1) {
      return { 
        valid: false, 
        error: `Error: ${nodesWithoutTarget.length} nodes have empty target handles. Please connect all nodes before saving.`,
        disconnectedNodes: nodesWithoutTarget
      };
    }
    
    return { valid: true };
  }
}));

export default useFlowStore;
