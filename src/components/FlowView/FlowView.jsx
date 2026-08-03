import { useCallback, useEffect, useState } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import PageNode from './PageNode';
import { useStore } from '../../store/useStore';
import { Plus, Unlink } from 'lucide-react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

const nodeTypes = {
  pageNode: PageNode,
};

const nodeWidth = 300;
const nodeHeight = 140;

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 40, ranksep: 60 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  // Only layout structural hierarchy edges in Dagre, ignore block route edges
  const hierarchyEdges = edges.filter(e => e.type !== 'blockRoute');

  hierarchyEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  let maxConnectedY = 0;

  const connectedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const yPos = nodeWithPosition ? nodeWithPosition.y - nodeHeight / 2 : 0;
    if (yPos > maxConnectedY) maxConnectedY = yPos;

    return {
      ...node,
      targetPosition: 'top',
      sourcePosition: 'bottom',
      position: {
        x: nodeWithPosition ? nodeWithPosition.x - nodeWidth / 2 : 0,
        y: yPos,
      },
    };
  });

  let floatingOffset = 0;
  const layoutedNodes = connectedNodes.map(node => {
    const hasHierarchyParent = hierarchyEdges.some(e => e.target === node.id);
    const hasHierarchyChild = hierarchyEdges.some(e => e.source === node.id);
    
    if (node.id !== 'root' && !hasHierarchyParent && !hasHierarchyChild) {
      const floatX = (floatingOffset % 3) * (nodeWidth + 40);
      const floatY = maxConnectedY + 200 + Math.floor(floatingOffset / 3) * (nodeHeight + 40);
      floatingOffset++;
      return {
        ...node,
        position: { x: floatX, y: floatY }
      };
    }
    return node;
  });

  return { nodes: layoutedNodes, edges };
};

function FlowCanvas({ onEditNode }) {
  const pages = useStore(state => state.pages);
  const blocksMap = useStore(state => state.blocks);
  const reparentPage = useStore(state => state.reparentPage);
  const addPage = useStore(state => state.addPage);
  const addDisconnectedPage = useStore(state => state.addDisconnectedPage);
  const deletePage = useStore(state => state.deletePage);
  const hasDependencies = useStore(state => state.hasDependencies);

  const { getIntersectingNodes, fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dragTargetNodeId, setDragTargetNodeId] = useState(null);
  
  const [pageToDelete, setPageToDelete] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleRequestDelete = (pageId) => {
    if (hasDependencies(pageId)) {
      setPageToDelete(pageId);
    } else {
      deletePage(pageId);
      setSelectedNode(null);
    }
  };

  // Transform pages and blocks into nodes and edges (hierarchy + dashed block routing links)
  useEffect(() => {
    const sortedPages = [...pages].sort((a, b) => (a.order || 0) - (b.order || 0));
    const pageIdSet = new Set(pages.map(p => p.id));

    const initialNodes = sortedPages.map((page) => ({
      id: page.id,
      type: 'pageNode',
      data: {
        title: page.title,
        description: page.description,
        isDragTarget: page.id === dragTargetNodeId,
        onEdit: onEditNode,
      },
      position: { x: 0, y: 0 },
    }));

    // 1. Hierarchy Edges (Solid Lines)
    const hierarchyEdges = sortedPages
      .filter((page) => page.parentId !== null && pageIdSet.has(page.parentId))
      .map((page) => ({
        id: `e-hierarchy-${page.parentId}-${page.id}`,
        source: page.parentId,
        target: page.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: 'var(--border-color)', strokeWidth: 2 }
      }));

    // 2. Block Routing Edges (Dashed Lines)
    const blockEdges = [];
    Object.entries(blocksMap || {}).forEach(([sourcePageId, blocks]) => {
      if (!pageIdSet.has(sourcePageId) || !Array.isArray(blocks)) return;
      blocks.forEach((block) => {
        if (Array.isArray(block.routesTo)) {
          block.routesTo.forEach((targetPageId) => {
            if (pageIdSet.has(targetPageId) && targetPageId !== sourcePageId) {
              blockEdges.push({
                id: `e-block-${sourcePageId}-${targetPageId}-${block.id}`,
                source: sourcePageId,
                target: targetPageId,
                type: 'blockRoute',
                animated: false,
                style: { stroke: 'var(--primary-color)', strokeWidth: 2, strokeDasharray: '6, 6' },
                label: block.title ? `Block: ${block.title}` : 'Block Link',
                labelStyle: { fill: 'var(--primary-color)', fontSize: '0.6875rem', fontWeight: 500 },
                labelBgStyle: { fill: 'var(--bg-surface)', rx: 4, ry: 4 }
              });
            }
          });
        }
      });
    });

    const allEdges = [...hierarchyEdges, ...blockEdges];

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      allEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);

    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
  }, [pages, blocksMap, dragTargetNodeId, setNodes, setEdges, onEditNode, fitView]);

  const onNodeDrag = useCallback(
    (event, node) => {
      const intersections = getIntersectingNodes(node).filter(n => n.id !== node.id);
      if (intersections.length > 0) {
        setDragTargetNodeId(intersections[0].id);
      } else {
        setDragTargetNodeId(null);
      }
    },
    [getIntersectingNodes]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      const intersections = getIntersectingNodes(node).filter(n => n.id !== node.id);
      
      if (intersections.length > 0) {
        const targetId = intersections[0].id;
        reparentPage(node.id, targetId);
      } else {
        if (node.id !== 'root') {
          reparentPage(node.id, null);
        }
      }
      setDragTargetNodeId(null);
    },
    [getIntersectingNodes, reparentPage]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      nodeTypes={nodeTypes}
      onSelectionChange={(params) => {
        setSelectedNode(params.nodes[0]?.id || null);
      }}
      fitView
      minZoom={0.4}
      maxZoom={1.2}
      className="site-planner-flow"
    >
      <Background color="var(--border-color)" gap={20} size={1} />
      <Controls showInteractive={false} />
      <MiniMap 
        nodeColor={() => 'var(--primary-color)'}
        maskColor="rgba(0,0,0,0.2)"
        style={{ backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}
      />

      <Panel position="top-right" style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => {
            const parentId = selectedNode || 'root';
            addPage(parentId);
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--primary-text)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            fontSize: '0.875rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <Plus size={16} />
          Add Child Page
        </button>

        <button
          onClick={addDisconnectedPage}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            fontSize: '0.875rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <Unlink size={16} />
          Add Floating Page
        </button>

        {selectedNode && selectedNode !== 'root' && (
          <button
            onClick={() => handleRequestDelete(selectedNode)}
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--danger-color)',
              color: 'white',
              borderRadius: 'var(--radius-md)',
              fontWeight: 500,
              fontSize: '0.875rem'
            }}
          >
            Delete Selected
          </button>
        )}
      </Panel>

      <ConfirmModal
        isOpen={!!pageToDelete}
        onClose={() => setPageToDelete(null)}
        onConfirm={() => {
          if (pageToDelete) {
            deletePage(pageToDelete);
            setSelectedNode(null);
          }
        }}
        title="Delete Page?"
        isDanger={true}
        confirmText="Delete"
        message="This page has child pages, content blocks, or attachments. Deleting it will also permanently delete all associated items."
      />
    </ReactFlow>
  );
}

export default function FlowView({ onEditNode }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <FlowCanvas onEditNode={onEditNode} />
      </ReactFlowProvider>
    </div>
  );
}
