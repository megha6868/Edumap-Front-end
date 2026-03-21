// "use client";

// import React, { useEffect, useState } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   MiniMap,
// } from "reactflow";
// import "reactflow/dist/style.css";

// import dagre from "dagre";

// const nodeWidth = 260;
// const nodeHeight = 90;

// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));

// /* ---------- AUTO LAYOUT ---------- */

// const layoutGraph = (nodes, edges) => {
//   dagreGraph.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 120 });

//   nodes.forEach((node) => {
//     dagreGraph.setNode(node.id, {
//       width: nodeWidth,
//       height: nodeHeight,
//     });
//   });

//   edges.forEach((edge) => {
//     dagreGraph.setEdge(edge.source, edge.target);
//   });

//   dagre.layout(dagreGraph);

//   nodes.forEach((node) => {
//     const position = dagreGraph.node(node.id);

//     node.position = {
//       x: position.x - nodeWidth / 2,
//       y: position.y - nodeHeight / 2,
//     };
//   });

//   return { nodes, edges };
// };

// /* ---------- DEPTH DETECTION ---------- */

// const computeDepths = (root, edges) => {
//   const depth = {};
//   depth[root.replace(" ", "_")] = 0;

//   const queue = [root.replace(" ", "_")];

//   while (queue.length) {
//     const node = queue.shift();

//     edges.forEach((edge) => {
//       if (edge.source === node && depth[edge.target] === undefined) {
//         depth[edge.target] = depth[node] + 1;
//         queue.push(edge.target);
//       }
//     });
//   }

//   return depth;
// };

// /* ---------- COLOR PALETTE ---------- */

// const depthColors = [
//   "#2563EB", // root
//   "#7C3AED",
//   "#0EA5E9",
//   "#10B981",
//   "#F59E0B",
// ];

// /* ---------- MAIN COMPONENT ---------- */

// export default function ConceptMap({ conceptData }) {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);

//   useEffect(() => {
//     if (!conceptData) return;

//     const depthMap = computeDepths(conceptData.root, conceptData.edges);

//     /* -------- CREATE NODES -------- */

//     const formattedNodes = conceptData.nodes.map((node) => {
//       const depth = depthMap[node.id] ?? 3;

//       const color = depthColors[Math.min(depth, depthColors.length - 1)];

//       return {
//         id: node.id,
//         data: { label: node.data.label },
//         position: { x: 0, y: 0 },
//         style: {
//           background: depth === 0 ? color : "#ffffff",
//           color: depth === 0 ? "white" : "#111",
//           border: `3px solid ${color}`,
//           borderRadius: "16px",
//           padding: "14px",
//           width: nodeWidth,
//           textAlign: "center",
//           fontSize: "14px",
//           fontWeight: "600",
//           boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
//         },
//       };
//     });

//     /* -------- CREATE EDGES -------- */

//     const formattedEdges = conceptData.edges.map((edge) => ({
//       id: edge.id,
//       source: edge.source,
//       target: edge.target,
//       animated: true,
//       style: {
//         stroke: "#6366F1",
//         strokeWidth: 2,
//       },
//     }));

//     const layouted = layoutGraph(formattedNodes, formattedEdges);

//     setNodes(layouted.nodes);
//     setEdges(layouted.edges);
//   }, [conceptData]);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "650px",
//         borderRadius: "16px",
//         background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
//         border: "1px solid #e5e7eb",
//       }}
//     >
//       <ReactFlow nodes={nodes} edges={edges} fitView>

//         <MiniMap
//           nodeColor={(node) => {
//             if (node.style?.background !== "#ffffff") return node.style.background;
//             return "#6366F1";
//           }}
//         />

//         <Controls />

//         <Background gap={16} size={1} />

//       </ReactFlow>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import dagre from "dagre";

const nodeWidth = 260;
const nodeHeight = 90;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

/* ---------- AUTO LAYOUT ---------- */

const layoutGraph = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const position = dagreGraph.node(node.id);

    node.position = {
      x: position.x - nodeWidth / 2,
      y: position.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
};

/* ---------- DEPTH DETECTION ---------- */

const computeDepths = (root, edges) => {
  const depth = {};
  depth[root.replace(" ", "_")] = 0;

  const queue = [root.replace(" ", "_")];

  while (queue.length) {
    const node = queue.shift();

    edges.forEach((edge) => {
      if (edge.source === node && depth[edge.target] === undefined) {
        depth[edge.target] = depth[node] + 1;
        queue.push(edge.target);
      }
    });
  }

  return depth;
};

/* ---------- COLOR PALETTE ---------- */

const depthColors = [
  "#2563EB", // root
  "#7C3AED",
  "#0EA5E9",
  "#10B981",
  "#F59E0B",
];

/* ---------- MAIN COMPONENT ---------- */

export default function ConceptMap({ conceptData }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  /* ---------- NODE CLICK ---------- */

  const onNodeClick = (event, node) => {
    setSelectedConcept(node.data);
    setActiveNode(node.id);
  };

  useEffect(() => {
    if (!conceptData) return;

    const depthMap = computeDepths(conceptData.root, conceptData.edges);

    /* -------- CREATE NODES -------- */

    const formattedNodes = conceptData.nodes.map((node) => {
      const depth = depthMap[node.id] ?? 3;

      const color = depthColors[Math.min(depth, depthColors.length - 1)];

      return {
        id: node.id,
        data: {
          label: node.data.label,
          explanation: node.data.explanation,
        },
        position: { x: 0, y: 0 },
        style: {
          background: depth === 0 ? color : "#ffffff",
          color: depth === 0 ? "white" : "#111",
          border: `3px solid ${color}`,
          borderRadius: "16px",
          padding: "14px",
          width: nodeWidth,
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow:
            node.id === activeNode
              ? "0 0 0 4px rgba(99,102,241,0.35)"
              : "0 6px 18px rgba(0,0,0,0.15)",
        },
      };
    });

    /* -------- CREATE EDGES -------- */

    const formattedEdges = conceptData.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: {
        stroke: "#6366F1",
        strokeWidth: 2.5,
        strokeDasharray: "4 2",
      },
    }));

    const layouted = layoutGraph(formattedNodes, formattedEdges);

    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [conceptData, activeNode]);

  return (
    <div
      style={{
        width: "100%",
        height: "650px",
        borderRadius: "16px",
        background: "linear-gradient(135deg,#f8fafc,#eef2ff)",
        border: "1px solid #e5e7eb",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable={true}
        nodesConnectable={false}
        zoomOnScroll={true}
        panOnDrag={true}
      >
        <MiniMap
          nodeColor={(node) => {
            if (node.style?.background !== "#ffffff")
              return node.style.background;
            return "#6366F1";
          }}
        />

        <Controls />

        <Background gap={16} size={1} />
      </ReactFlow>

      {/* ---------- EXPLANATION PANEL ---------- */}

      {selectedConcept && (
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            width: "320px",
            background: "white",
            borderRadius: "14px",
            padding: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 10,
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: "16px",
              color: "#111",
            }}
          >
            {selectedConcept.label}
          </h3>

          <p
            style={{
              marginTop: "10px",
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#444",
            }}
          >
            {selectedConcept.explanation ||
              "Explanation not available for this concept."}
          </p>

          <button
            style={{
              marginTop: "14px",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "none",
              background: "#6366F1",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
            }}
            onClick={() => {
              setSelectedConcept(null);
              setActiveNode(null);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}