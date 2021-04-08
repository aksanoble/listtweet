import { groupBy, maxBy, orderBy, get, set as _set, union } from "lodash";
import pThrottle from "p-throttle";
import logger from "./logger";
import boa from "@pipcook/boa";
const { list } = boa.builtins();
const networkx = boa.import("networkx");
const json = boa.import("jsonpickle");
const louvain = boa.import("community");
import { getConnectedFriends, makeDistinctList, writeListDB } from "./queries";

import { RATE_LIMITS } from "./globals";
import Twit from "twit";

export const j = v =>
  JSON.parse(
    json.encode(v, boa.kwargs({ unpicklable: false, make_refs: false }))
  );

export const createPerson = token => {
  const tClient = new Twit({
    consumer_key: process.env.TWITTER_ID,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.refreshToken
  });
  return {
    ...token,
    screen_name: token.screenName,
    profile_image_url_https: token.image,
    id_str: token.id,
    tClient,
    lists: {},
    throttle: {}
  };
};

export const getThrottle = (person, path, method) => {
  if (!get(person, `throttle.${path}.${method}`)) {
    const rateLimit = RATE_LIMITS[path][method];
    const throttleDefault = pThrottle({ limit: 1, interval: rateLimit });
    _set(person, `throttle.${path}.${method}`, throttleDefault);
  }
  return person.throttle[path][method];
};

export const nx = (d, account) => {
  const G = networkx.Graph();
  G.add_nodes_from(Object.keys(d.nodes));
  G.add_edges_from(d.links.map(l => [String(l.source), String(l.target)]));

  getClusters(G, d, account);
};

export const makeLists = async account => {
  const connectedFriends = await getConnectedFriends(account.id_str);
  const distinctFriends = await makeDistinctList(account.id_str);
  const getClusters = nx(connectedFriends, account);
};

const getClusters = (G, d, account) => {
  let nodesClusterMap = j(louvain.best_partition(G));
  let clusters = orderBy(
    Object.values(
      groupBy(Object.keys(nodesClusterMap), node => nodesClusterMap[node])
    ),
    "length",
    "desc"
  );
  let clusterCenter = {};
  // Change clusters length to 10
  if (clusters.length > 10) {
    const others = clusters.splice(5);
    clusterCenter["listtweet-others"] = union(...others);
  }
  console.log(clusterCenter, "pre-reduce");
  clusterCenter = clusters.reduce((acc, c) => {
    const centerNode = maxBy(c, n => j(list(G.neighbors(n))).length);
    acc[`listtweet-${d.nodes[centerNode].screenName}`] = c;
    return acc;
  }, clusterCenter);

  console.log(clusterCenter, "post-reduce");
  writeListDB(clusterCenter, account);
};
