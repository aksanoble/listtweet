import {
  values,
  groupBy,
  maxBy,
  isEmpty,
  get,
  set as _set,
  mapValues
} from "lodash";
import pThrottle from "p-throttle";
import natural from "natural";
import sendMail from "./sendmail";
import { listTweets } from "./stages/listStatus";
import EmailTmplInvalid from "./emailTemplates/email-template-invalid";
import data from "./data";
import logger from "./logger";
import boa from "@pipcook/boa";
const { list } = boa.builtins();
const networkx = boa.import("networkx");
const json = boa.import("jsonpickle");
import { getFriendsNetwork } from "./queries";
import fs from "fs";

import { RATE_LIMITS } from "./globals";
import Twit from "twit";

export const tweetText = t => {
  if (t.retweeted_status) {
    return t.retweeted_status.full_text;
  }
  return t.full_text;
};

export const addToClassifier = (person, tweets, listId) => {
  const classifier = person.classifier;
  if (tweets.length > 0) {
    const user = tweets[0].user.screen_name;
    const bio = tweets[0].user.description;
    classifier.addDocument(bio, listId);
    tweets.forEach(t => {
      classifier.addDocument(tweetText(t), listId);
    });
  }
};

export const classify = (person, user, tweets) => {
  console.log(`Classifiying Tweets of ${user}`);
  const classifiedList = maxBy(
    values(
      groupBy(tweets.map(t => person.classifier.classify(tweetText(t))))
    ).map(d => ({ name: d[0], count: d.length })),
    o => o.count
  ).name;
  if (!person.lists[classifiedList]) {
    person.lists[classifiedList] = [];
  }
  person.lists[classifiedList].push(user);
};

export const processLists = person => {
  if (isEmpty(person.preLists)) {
    sendMail(person, <EmailTmplInvalid {...person} />);
  } else if (person.preLists.length === 1) {
    sendMail(person, <EmailTmplInvalid {...person} />);
  } else {
    getListMembers(person);
  }
};

export const processListMembers = person => {
  const lists = Object.keys(person.membersByList);
  const memberedLists = lists.filter(l => person.membersByList[l].length > 0);
  const memberedListsCount = logger.info(
    `Lists before ${person.screenName}: ${JSON.stringify(
      mapValues(person.membersByList, m => m.length)
    )}`
  );
  if (memberedLists.length <= 1) {
    sendMail(person, <EmailTmplInvalid {...person} />);
  } else {
    console.log("Start processing list members tweet");
    listTweets(person);
  }
};

export const createPerson = token => {
  const classifier = new natural.BayesClassifier();
  const tClient = new Twit({
    consumer_key: process.env.TWITTER_ID,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.refreshToken
  });
  return {
    ...token,
    screen_name: token.screenName,
    id_str: token.id,
    classifier,
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

// Remove default seedAccount. Added for testing
export const nx = d => {
  const G = networkx.Graph();
  // fs.writeFileSync("./test.json", JSON.stringify(data));
  // console.log("Donw writing");
  // G.add_nodes_from(data.nodes.map(m => m.id));
  G.add_nodes_from(Object.keys(d.nodes).map(n => d.nodes[n].screenName));
  G.add_edges_from(
    d.links.map(l => [
      String(d.nodes[l.source].screenName),
      String(d.nodes[l.target].screenName)
    ])
  );
  G.remove_nodes_from(list(networkx.isolates(G)));
  // console.log(json.encode(list(networkx.isolates(G))));
  console.log(G.number_of_nodes(), "Count of nodes");
  console.log(G.number_of_edges(), "Count of edges");
  // const GCon = networkx.algorithms.components.connected_components(G);
  // console.log(networkx.is_connected(G), "is connected");
  let cluster = list(
    networkx.algorithms.community.asyn_fluid.asyn_fluidc(G, 6)
  );
  console.log(JSON.parse(json.encode(cluster)).map(c => c["py/set"]));
};

export const makeLists = async account => {
  const graphData = await getFriendsNetwork(account);
  // console.log(graphData, "GraphData");
  const getClusters = nx(graphData);
};
