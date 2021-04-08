import { ForceGraph2D } from "react-force-graph";
import { useState, useCallback, useEffect } from "react";
import Loading from "./loading";
import { get } from "lodash";
import { data } from "../data/aksanoble";
import Header from "./header";

const loadImage = (url, screenName) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", err => {
      img.src = `https://via.placeholder.com/150/000000/FFFFFF/?text=${screenName}`;
      resolve(img);
    });
    img.src = url;
  });

const loadAllImages = async nodesByName => {
  const images = await Promise.all(
    Object.values(nodesByName).map(n => {
      return loadImage(n.image, n.screenName);
    })
  );

  return images;
};

const Graph = props => {
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const { nodesByName } = props;

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = node => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node.id);
      if (node.neighbors) {
        node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
      }
      if (node.links) {
        node.links.forEach(link => highlightLinks.add(link));
      }
    }

    setHoverNode(get(node, "id", null));
    updateHighlight();
  };

  const paintRing = useCallback(
    ({ img, x, y, id, neighbors = [] }, ctx) => {
      // add ring just for highlighted nodes
      let size = 12;

      if (hoverNode) {
        size = size * 3;
        if (id === hoverNode) {
          ctx.strokeStyle = "red"; // some color/styl
          ctx.beginPath();
          ctx.strokeRect(x - size / 2, y - size / 2, size, size);
          ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        } else if (
          nodesByName[hoverNode].neighbors &&
          nodesByName[hoverNode].neighbors.includes(id)
        ) {
          ctx.strokeStyle = "red"; // some color/styl
          ctx.beginPath();
          ctx.strokeRect(x - size / 2, y - size / 2, size, size);
          ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
        }
      } else {
        ctx.strokeStyle = "#550527"; // some color/styl

        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      }
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
      <div width="100px" height="100px">
        {props.graphData && (
          <ForceGraph2D
            graphData={props.graphData}
            nodeLabel="id"
            linkWidth={link => (highlightLinks.has(link) ? 5 : 1)}
            linkDirectionalParticles={4}
            linkDirectionalParticleWidth={link =>
              highlightLinks.has(link) ? 4 : 0
            }
            nodeCanvasObject={paintRing}
            nodePointerAreaPaint={nodePointerAreaPaint}
            onNodeHover={handleNodeHover}
          />
        )}
      </div>
    </>
  );
};

const GraphWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gd, setGD] = useState({});
  const [nodesByName, setnodesByName] = useState({});
  useEffect(async () => {
    data.nodes = Object.values(data.nodes);

    const nodesByName = data.nodes.reduce((acc, node, i) => {
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
    const images = await loadAllImages(nodesByName);
    const graphData = {
      nodes: Object.values(nodesByName).map((n, i) => {
        return {
          ...n,
          img: images[i]
        };
      }),
      links: data.links
    };
    setGD(graphData);
    setnodesByName(nodesByName);
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Header />
          <Graph nodesByName={nodesByName} graphData={gd} />
        </>
      )}
    </>
  );
};

export default GraphWrapper;
