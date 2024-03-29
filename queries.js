import pThrottle from "p-throttle";
import { DISTINCT_LIST, COLORS, LT_STATUS, MAX_FRIENDS_COUNT } from "./globals";
import { pick, chunk, mapValues, omit } from "lodash";
import { getThrottle, networkCached, makeLists, createPerson } from "./utils";
import { addToGraph } from "./add-to-graph.js";
import EmailTemplate from "./emailTemplates/email-template-html";
import logger from "./logger.js";
import logToTelegram from "./telegram-log.js";
import neo4j from "neo4j-driver";
import sendMail from "./sendmail";
const { driver: _driver, auth, session: _session } = neo4j;

const driver = _driver(
  "bolt://localhost",
  auth.basic(process.env.NEO_USER, process.env.NEO_PASS)
);

let friendCount = 0;

const personProps = [
  "id_str",
  "name",
  "screen_name",
  "location",
  "description",
  "url",
  "followers_count",
  "friends_count",
  "created_at",
  "verified",
  "statuses_count",
  "lang",
  "profile_image_url_https",
  "profile_banner_url"
];

export const runCypher = async (command, params) => {
  var session = driver.session({
    database: "neo4j",
    defaultAccessMode: _session.WRITE
  });
  if (command != "") {
    const result = await session.run(command, params);
    await session.close();
    return result;
  }
  await session.close();
  return;
};

export const getAllFollowing = async (
  person,
  // Change default back to 65000
  throttle = pThrottle({ limit: 1, interval: 65000 }),
  cursor = -1,
  depth = 0,
  isLastUser = false,
  seedAccount = person
) => {
  const T = person.tClient;
  const screenName = person.screen_name;

  logger.info(`Fetching friends for ${person.name} depth is ${depth}`);
  const networkFetched = await getNetworkStatus(person);
  const fetchedRecently = networkCached(
    networkFetched.records[0].get("n").properties.nFetched
  );
  if (depth > 0 && !!fetchedRecently) {
    logger.info(`Already cached, skipping: ${person.screen_name}`);
    if (isLastUser) {
      await makeLists(seedAccount);
    }
  } else {
    const friends = await throttle(() => {
      return T.get(`friends/list`, {
        screen_name: screenName,
        count: 200,
        cursor
      });
    })();

    logger.info(
      `Friends fetched for ${person.name}: ${friends.data.users.length}`
    );

    //Added for testing. To be removed
    // friends.data.next_cursor = null;
    // friends.data.users = friends.data.users.slice(0, 1);
    if (depth < 1) {
      // Remove slice constraint after testing
      const lastPage = !friends.data.next_cursor;
      const users = friends.data.users.filter(
        u => u.friends_count <= MAX_FRIENDS_COUNT
      );
      users.forEach((u, index) => {
        const isLastUser = index == users.length - 1 && lastPage;
        u.tClient = person.tClient;
        getAllFollowing(
          Object.assign({}, u),
          throttle,
          (cursor = -1),
          1,
          isLastUser,
          seedAccount
        );
      });
    }
    const users = friends.data.users.map(u => ({
      ...u,
      json: JSON.stringify(pick(u, personProps))
    }));

    const personToAdd = {
      ...pick(person, [
        "name",
        "screen_name",
        "id_str",
        "profile_image_url_https"
      ]),
      users: users,
      json: JSON.stringify(pick(person, personProps))
    };
    addToGraph(personToAdd);
    if (friends.data.next_cursor) {
      getAllFollowing(
        Object.assign({}, person),
        throttle,
        friends.data.next_cursor_str,
        depth,
        isLastUser,
        seedAccount
      );
    } else if (isLastUser) {
      updateNetworkStatus(person);
      await makeLists(seedAccount);
    } else if (depth === 0 && friends.data.users.length === 0) {
      updateNetworkStatus(person);
    } else {
      updateNetworkStatus(person);
    }
  }
};

export const getConnectedFriends = async account => {
  const response = await runCypher(
    `match (:Account {id: $account})-[:FOLLOWS]->(n: Account)-[r:FOLLOWS]->(p:Account)<-[:FOLLOWS]-(:Account {id: $account}) return n,r,p`,
    { account }
  );
  const data = response.records.reduce(
    (acc, record) => {
      const a = record.get("n");
      const b = record.get("p");
      const r = record.get("r");
      !acc.nodes[a.identity.low] && (acc.nodes[a.identity.low] = a.properties);
      !acc.nodes[b.identity.low] && (acc.nodes[b.identity.low] = b.properties);

      acc.links.push({
        source: r.start.low,
        target: r.end.low
      });

      return acc;
    },
    { links: [], nodes: {} }
  );
  return data;
};

export const makeDistinctList = async account => {
  const response = await runCypher(
    `match (:Account {id: $account})-[:FOLLOWS]->(n: Account)-[r:FOLLOWS]->(p:Account)<-[:FOLLOWS]-(:Account {id: $account}) 
    with collect (distinct n) as faccounts
    match (n: Account {id: $account})-[r:FOLLOWS]->(p) with p
    where not p in faccounts with p
    match(p)<-[r:FOLLOWS]-(:Account {id: $account}) set r.list = '${DISTINCT_LIST}'
    return p`,
    { account }
  );
  const data = response.records;
  return data;
};

export const writeListDB = async (clusters, account) => {
  let clusterPairs = {
    clusters: Object.entries(clusters).map(c => ({
      list: c[0],
      nodes: c[1].map(n => Number(n))
    }))
  };

  const response = await runCypher(
    `unwind $clusters as cluster
    unwind cluster.nodes as n
    match (:Account {id: $account})-[r:FOLLOWS]->(p: Account) where ID(p) = n set r.list = cluster.list
    return count(p)`,
    { clusters: clusterPairs.clusters, account: account.id_str }
  );
  createLists(account);
};

export const createLists = async account => {
  const T = account.tClient;
  const throttleDefault = getThrottle(account, "lists/create", "post");
  const response = await runCypher(
    `
  match (:Account {id: $account})-[r:FOLLOWS]->() return distinct(r.list) as list
  `,
    { account: account.id_str }
  );

  let lists = response.records
    .map(r => {
      return r.get("list");
    })
    .filter(l => !!l);

  let createLists = await Promise.all(
    lists.map(l => {
      return throttleDefault(() => {
        return T.post(`lists/create`, {
          name: l,
          mode: "private"
        });
      })();
    })
  );

  lists = lists.map((l, i) => ({ id: createLists[i].data.id_str, name: l }));
  updateListIds(account, lists);
};
export const addMembersToList = async person => {
  const membersByList = await getListMembers(person);
  const T = person.tClient;
  const lists = Object.keys(membersByList);
  const throttleDefault = getThrottle(
    person,
    "lists/members/create_all",
    "post"
  );
  const bulkAdd = await Promise.all(
    lists.map(l => {
      const membersChunked = chunk(membersByList[l].nodes, 100);
      return Promise.all(
        membersChunked.map(async members => {
          return throttleDefault(async () => {
            await T.post(`lists/members/create_all`, {
              screen_name: members,
              list_id: l,
              owner_screen_name: person.screenName
            });
          })();
        })
      );
    })
  );
  logger.info(
    `Done creating lists for ${person.screenName} : ${JSON.stringify(
      mapValues(membersByList, members => members.length)
    )}`
  );

  const emailProps = { person, lists: membersByList };

  sendMail(person, <EmailTemplate {...emailProps} />);
  updateStatus(person, LT_STATUS.completed);
  console.log("Done adding members to list");
};

export const getListMembers = async account => {
  console.log("Getting list members");
  const response = await runCypher(
    `
    match (:Account {id: $id})-[r:FOLLOWS]->(q) return collect(q) as q, r.listId as listId, r.list as listName
  `,
    { id: account.id_str }
  );

  const listMembers = response.records.reduce((acc, r) => {
    const list = r.get("listId");
    const listName = r.get("listName");
    const nodes = r.get("q");
    acc[list] = { nodes: nodes.map(n => n.properties.screenName), listName };
    return acc;
  }, {});

  return listMembers;
};

export const updateListIds = async (account, lists) => {
  const response = await runCypher(
    `
  unwind $lists as l
  match (:Account {id: $id})-[r:FOLLOWS {list: l.name}]->(p: Account) set r.listId = l.id
  return count(l)
  `,
    { id: account.id_str, lists }
  );
  addMembersToList(account);

  console.log("Updated Lists with Ids", response.records);
};

export const getAllConnections = async account => {
  const nodesResponse = await runCypher(
    `
    match (:Account {id: $id})-[r:FOLLOWS]->(n: Account) return n,r
  `,
    { id: account }
  );

  const linksResponse = await runCypher(
    `
    match (:Account {id: $id})-[:FOLLOWS]->(n: Account)-[r:FOLLOWS]->(p:Account)<-[:FOLLOWS]-(:Account {id: $id}) return r
  `,
    { id: account }
  );

  const lists = new Set();
  let data = nodesResponse.records.reduce(
    (acc, r) => {
      const node = r.get("n");
      const rel = r.get("r");
      acc.nodes[node.identity.low] = {
        ...omit(node.properties, "json"),
        tId: node.properties.id,
        id: node.properties.screenName,
        list: rel.properties.list,
        listId: rel.properties.listId
      };
      lists.add(rel.properties.list);
      return acc;
    },
    { nodes: {} }
  );

  data.links = linksResponse.records.map(r => {
    const link = r.get("r");
    const nodes = data.nodes;
    return {
      source: nodes[link.start.low].id,
      target: nodes[link.end.low].id,
      color: COLORS[[...lists].indexOf(nodes[link.start.low].list)]
    };
  });

  return data;
};

const getStatus = async account => {
  const response = await runCypher(
    `
    merge (n:Account {id: $id}) set n.name = $name, n.screenName = $screenName, n.accessToken = $accessToken, n.accessSecret = $accessSecret, n.email = $email return n.ltStatus as status
  `,
    {
      id: account.id_str,
      email: account.email,
      accessToken: account.accessToken,
      accessSecret: account.refreshToken,
      name: account.name,
      screenName: account.screenName
    }
  );

  return response;
};

const updateStatus = async (account, status) => {
  const response = await runCypher(
    `merge (n: Account {id: $id}) set n.ltStatus = $status, n.email = $email, n.accessToken = $accessToken, n.accessSecret = $accessSecret return n`,
    {
      id: account.id_str,
      email: account.email,
      accessToken: account.accessToken,
      accessSecret: account.refreshToken,
      status
    }
  );

  return response;
};

const updateNetworkStatus = async account => {
  const response = await runCypher(
    `merge (n: Account {id: $id}) set n.nFetched = $timestamp return n`,
    {
      id: account.id_str,
      timestamp: new Date().toISOString()
    }
  );

  return response;
};

const getNetworkStatus = async account => {
  const response = await runCypher(`merge (n: Account {id: $id}) return n`, {
    id: account.id_str
  });

  return response;
};

const getUserTwitter = async person => {
  const T = person.tClient;
  const user = await T.get("/users/show", { screen_name: person.screenName });

  return user.data;
};

export const toFetchNetwork = async account => {
  const response = await getStatus(account);
  const status = response.records[0].get("status");
  if (!status) {
    const userDetails = await getUserTwitter(account);
    if (
      userDetails.friends_count === 0 ||
      userDetails.friends_count > MAX_FRIENDS_COUNT
    ) {
      const response = await updateStatus(account, LT_STATUS.invalid);
      return LT_STATUS.invalid;
    } else {
      const response = await updateStatus(account, LT_STATUS.progress);
      getAllFollowing(account);
      return LT_STATUS.progress;
    }
  }
  return status;
};

export const getInProgress = async () => {
  const response = await runCypher(
    `match (n: Account {ltStatus: "${LT_STATUS.progress}"}) return n`
  );

  const records = response.records;
  records.forEach(r => {
    const user = r.get("n");
    const account = createPerson({
      accessToken: user.properties.accessToken,
      refreshToken: user.properties.accessSecret,
      image: user.properties.image,
      screenName: user.properties.screenName,
      id: user.properties.id,
      name: user.properties.name,
      email: user.properties.email
    });
    getAllFollowing(account);
    logToTelegram(`Network fetch restarted for ${user.properties.screenName}`);
  });
};

// Hack to trigger restart unfinished network fetches. To be run once

process
  .on("unhandledRejection", async (reason, p) => {
    await logToTelegram(`${reason} "Unhandled Rejection at Promise", ${p}`);
  })
  .on("uncaughtException", async err => {
    await logToTelegram(`${err}, "Uncaught Exception thrown"`);
    process.exit(1);
  });

getInProgress();
