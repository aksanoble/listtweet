import cytoscape from "cytoscape";
import fs from "fs";
import data from "../data.js";

data.nodes = data.nodes.map(n => ({
  data: n
}));
data.links = data.links.map((l, i) => ({ data: { id: i, ...l } }));

const cy = cytoscape({
  elements: [...data.nodes, ...data.links]
});
var clusters = cy.elements().kMeans({
  k: 2,
  maxIterations: 50
});

console.log(clusters, "clusters");

// import createGraph from "ngraph.graph";
// import detectClusters from "ngraph.louvain";

// import _ from "lodash";
// const { groupBy, mapValues } = _;

// const clusters = JSON.parse(fs.readFileSync("./cl.json", "utf-8"));

// const clusterLength = groupBy(Object.keys(clusters), k => clusters[k]);
// console.log(mapValues(clusterLength, v => v.length));

// console.log(Object.keys(clusterLength).length);

// const g = createGraph();
// data.links.forEach(l => {
//   g.addLink(l.source, l.target);
// });

// const clusters = detectClusters(g);
// const clustersByNode = {};
// g.forEachNode(function(node) {
//   console.log(node.id, clusters.getClass(node.id));
//   clustersByNode[node.id] = clusters.getClass(node.id);
// });

// fs.writeFileSync("./cl.json", JSON.stringify(clustersByNode));
