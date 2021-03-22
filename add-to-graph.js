import neo4j from "neo4j-driver";
const { driver: _driver, auth, session: _session } = neo4j;
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env.local"
});
import Twit from "twit";
import { getAllFollowing } from "./queries.js";

const getAccountsQuery = `match (n: Account)-[r:FOLLOWS]->(p) return n, r, p`;
// const getAccountsQuery = `MATCH ()-[r:FOLLOWS]->(n) WITH  n, count(r) as cnt WHERE cnt>1 return n`;
// const getAccountsQuery = `match (n: Account {screenName: "aksanoble"})-[r]-(p) return n,r,p`;
const person = {
  tClient: new Twit({
    consumer_key: process.env.TWITTER_ID,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }),
  screen_name: "aksanoble",
  name: "Akshay Kanthi"
};

// account.users = account.users.map(u => ({
//   ...u,
//   json: JSON.stringify(u)
// }));

// const driver = _driver(
//   "bolt://localhost",
//   auth.basic(process.env.NEO_USER, process.env.NEO_PASS)
// );

const runCypher = async (command, params) => {
  var session = driver.session({
    database: "neo4j",
    defaultAccessMode: _session.WRITE
  });
  if (command != "") {
    const result = await session.run(command, params);
    session.close();
    return result;
  }
  return;
};

const addAccountCypher = account => {
  if (!account) {
    console.error("No name found in Crawl", account);
    return "";
  }

  const keyQueryUnwindMap = {
    users:
      "unwind $users as user merge (u:Account {name: user.name}) set u.screenName = user.screen_name, u.json = user.json merge (a)-[:FOLLOWS]->(u)"
  };

  let queryString =
    "merge (a:Account {name: $name}) set a.screenName = $screen_name";

  queryString = Object.keys(keyQueryUnwindMap).reduce((acc, key) => {
    if (account[key]) {
      return acc + "\n with a\n" + keyQueryUnwindMap[key];
    }
    return acc;
  }, queryString);

  queryString += "\n return a";
  return queryString;
};

export const addToGraph = acc => {
  // console.log(`Adding to Graph ${acc.name}`);
  // runCypher(addAccountCypher(acc), acc).then(async data => {
  //   data.records.forEach(r => {
  //     // console.log(`${r.get("a")} added to Graph`);
  //   });
  // });
};

// getAllFollowing(person);

runCypher(getAccountsQuery)
  .then(resp => {
    const records = resp.records.reduce((acc, r) => {
      acc[r.get("n").properties.screenName] = r.get("n");
      acc[r.get("p").properties.screenName] = r.get("p");
      // acc.links.push({
      //   source: acc.nodes[r.get("r").start.low].properties.screenName,
      //   target: acc.nodes[r.get("r").end.low].properties.screenName
      // });
      return acc;
    }, {});
    // records.nodes = Object.values(records.nodes).map(node => ({
    //   id: node.properties.screenName
    // }));
    fs.writeFileSync("./data-map-v8.json", JSON.stringify(records));
    console.log("Done writing");
  })
  .catch(e => {
    console.log("There was an error in reading graph", e);
  });

// const data = fs.readFileSync("./data.json", "utf-8");

// console.log(
//   data
//     .trim()
//     .split("\n")
//     .map(s => JSON.parse(s))[0]
// );