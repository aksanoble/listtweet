import { ForceGraph2D } from "react-force-graph";
import { useState, useMemo, useCallback } from "react";
import { get } from "lodash";
import data from "../data";

const NODE_R = 8;

const nodesByName = data.nodes.reduce((acc, node) => {
  const img = new Image();
  img.src = node.img;
  node.img = img;
  acc[node.id] = node;
  return acc;
}, {});

data.links.forEach(link => {
  const a = nodesByName[link.source];
  const b = nodesByName[link.target];
  !a.neighbors && (a.neighbors = []);
  !b.neighbors && (b.neighbors = []);
  a.neighbors.push(b.id);
  b.neighbors.push(a.id);

  !a.links && (a.links = []);
  !b.links && (b.links = []);
  a.links.push(link);
  b.links.push(link);
});

const graphData = {
  nodes: Object.values(nodesByName),
  links: data.links
};

const Graph = props => {
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = node => {
    console.log("hover called ", node);
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node.id);
      node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
      node.links.forEach(link => highlightLinks.add(link));
    }

    setHoverNode(get(node, "id", null));
    updateHighlight();
  };

  const handleLinkHover = link => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  const paintRing = useCallback(
    ({ img, x, y, id, neighbors }, ctx) => {
      // add ring just for highlighted nodes
      const size = 12;
      console.log("Hover called");
      if (hoverNode) {
        if (id === hoverNode || (neighbors ? neighbors.includes(id) : false)) {
          ctx.strokeStyle = "red"; // some color/styl
          ctx.beginPath();
          ctx.strokeRect(x - size / 2, y - size / 2, size, size);
          ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        }
      } else {
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      }

      // ctx.arc(x, y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      // // ctx.fillStyle = id === hoverNode ? "red" : "orange";
      // ctx.fill();
    },
    [hoverNode]
  );

  const nodeCanvasObject = ({ img, x, y }, ctx) => {
    const size = 12;
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
  };
  const nodePointerAreaPaint = (node, color, ctx) => {
    const size = 12;
    ctx.fillStyle = color;
    ctx.fillRect(node.x - size / 2, node.y - size / 2, size, size); // draw square as pointer trap
  };
  return (
    <>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeCanvasObject={paintRing}
        nodePointerAreaPaint={nodePointerAreaPaint}
        onNodeHover={handleNodeHover}
      />
    </>
  );
};

export default Graph;
