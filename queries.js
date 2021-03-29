import pThrottle from "p-throttle";
import { makeLists } from "./utils";
import { DISTINCT_LIST } from "./globals";
import lodash from "lodash";
const { pick } = lodash;
// import { processListMembers, getThrottle } from "./utils";
import { addToGraph } from "./add-to-graph.js";
// import EmailTemplate from "./emailTemplates/email-template-html";
import logger from "./logger.js";
import fs from "fs";
// import { account } from "./data/friends";
import logToTelegram from "./telegram-log.js";
import { nx } from "./utils";
import neo4j from "neo4j-driver";
const { driver: _driver, auth, session: _session } = neo4j;

const driver = _driver(
  "bolt://localhost",
  auth.basic(process.env.NEO_USER, process.env.NEO_PASS)
);

let friendCount = 0;

// import sendMail from "./sendmail";

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
    session.close();
    return result;
  }
  return;
};

// export const getLists = async (
//   person,
//   throttle = pThrottle({ limit: 1, interval: 65000 }),
//   cursor = -1,
//   acc = []
// ) => {
//   console.log(`Fetcing all Lists for ${person.name}`);
//   const T = person.tClient;
//   const ownerScreenName = person.screen_name;
//   const lists = await throttle(() => {
//     return T.get(`lists/ownerships`, {
//       owner_screen_name: ownerScreenName,
//       cursor
//     });
//   })();
//   acc = [...acc, ...lists.data.lists];
//   if (lists.data.next_cursor) {
//     return getLists(person, throttle, lists.data.next_cursor_str, acc);
//   }
//   console.log(`Fetched all Lists for ${person.name}`);
//   return {
//     ...person,
//     preLists: acc
//   };
// };

// export const getListMembers = async person => {
//   const lists = person.preLists;
//   const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
//   const T = person.tClient;
//   const ownerScreenName = person.screen_name;
//   console.log(`Fetching all members of lists for ${person.name}`);
//   let listMembers = await Promise.all(
//     lists.map(l => {
//       return throttleDefault(async () => {
//         const res = await T.get(`lists/members`, {
//           list_id: l.id_str,
//           owner_screen_name: ownerScreenName
//         });
//         return res.data.users;
//       })();
//     })
//   );

//   const membersByList = listMembers.reduce((acc, current, index) => {
//     acc[lists[index].id_str] = current;
//     return acc;
//   }, {});
//   processListMembers({
//     ...person,
//     membersByList
//   });
// };

// export const getAllTweetsList = async (person, lists) => {
//   const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
//   const T = person.tClient;
//   const ownerScreenName = person.screen_name;

//   let tweetsByList = await Promise.all(
//     lists.map(l => {
//       return throttleDefault(async () => {
//         const res = await T.get(
//           `lists/members?list_id=${l.id}&owner_screen_name=${ownerScreenName}`
//         );
//         const tweets = await getTweetsAll(person, res.data.users);
//         return {
//           id: l.id,
//           tweets
//         };
//       })();
//     })
//   );

//   tweetsByList = tweetsByList.reduce((acc, byList) => {
//     acc[byList.id] = byList.tweets;
//     return acc;
//   }, {});

//   return tweetsByList;
// };

// export const getTweetsAll = async (person, users, cursor) => {
//   const throttleDefault = getThrottle(person, "statuses/user_timeline", "get");
//   const T = person.tClient;
//   const tweets = await Promise.all(
//     users.map(u => {
//       return throttleDefault(async () => {
//         const res = await T.get(`statuses/user_timeline`, {
//           screen_name: u.screen_name,
//           tweet_mode: "extended"
//         });
//         classify(person, u.screen_name, res.data);
//         return res.data;
//       })();
//     })
//   );
//   if (!cursor) {
//     console.log(`Done classifiying all tweets`);
//     addToList(person);
//   }
//   return tweets.flat();
// };

export const getAllFollowing = async (
  person,
  // Change default back to 65000
  throttle = pThrottle({ limit: 1, interval: 65 }),
  cursor = -1,
  depth = 0,
  isLastUser = false,
  seedAccount = person.id_str
) => {
  const T = person.tClient;
  const screenName = person.screen_name;

  logger.info(`Fetching friends for ${person.name} depth is ${depth}`);
  const friends = await throttle(() => {
    return T.get(`friends/list`, { screen_name: screenName, cursor });
  })();

  logger.info(
    `Friends fetched for ${person.name}: ${friends.data.users.length}`
  );
  //Added for testing. To be removed
  friends.data.next_cursor = null;
  friends.data.users = friends.data.users.slice(0, 1);
  if (depth < 1) {
    // Remove slice constraint after testing
    const lastPage = !friends.data.next_cursor;
    logToTelegram(`Number of pages fetched ${++friendCount}`);
    friends.data.users.forEach((u, index) => {
      const isLastUser = index == friends.data.users.length - 1 && lastPage;
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
    ...pick(person, ["name", "screen_name", "id_str"]),
    users: users,
    json: JSON.stringify(pick(person, personProps))
  };
  // fs.writeFileSync("./test.json", JSON.stringify(personToAdd));
  addToGraph(personToAdd);
  // getTweetsAll(person, friends.data.users, friends.data.next_cursor);
  // acc = [...acc, ...friends.data.users];
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
    makeLists(seedAccount);
  }
};

export const getConnectedFriends = async account => {
  const response = await runCypher(
    `match (n: Account)-[r]-(p) where exists {
      match (:Account {id: $account})-[:FOLLOWS]->(p) where exists {
          match (: Account {id: $account})-[:FOLLOWS]->(n)
        }
    } return n,r,p`,
    { account }
  );
  const data = response.records.reduce(
    (acc, record) => {
      const a = record.get("n");
      const b = record.get("p");
      const r = record.get("r");
      !acc.nodes[a.identity.low] && (acc.nodes[a.identity.low] = a.properties);
      !acc.nodes[b.identity.low] && (acc.nodes[b.identity.low] = b.properties);
      acc.links.push({ source: r.start.low, target: r.end.low });

      return acc;
    },
    { links: [], nodes: {} }
  );
  return data;
};

export const makeDistinctList = async account => {
  const response = await runCypher(
    `match (n: Account)-[r]-(p) where exists {
      match (:Account {id: $account})-[:FOLLOWS]->(p) where exists {
        match (: Account {id: $account})-[:FOLLOWS]->(n)
      }
    } with collect (distinct n) as faccounts
    match (n: Account {id: $account})-[:FOLLOWS]->(p) with p
    where not p in faccounts with p
    match(p) set p.list = '${DISTINCT_LIST}'
    return p`,
    { account }
  );
  const data = response.records;
  return data;
};

// export const addToList = async person => {
//   const T = person.tClient;
//   const membersByList = person.lists;
//   const lists = Object.keys(membersByList);

//   const throttleDefault = getThrottle(
//     person,
//     "lists/members/create_all",
//     "post"
//   );

//   const bulkAdd = await Promise.all(
//     lists.map(l => {
//       const membersChunked = chunk(membersByList[l], 100);
//       return Promise.all(
//         membersChunked.map(async members => {
//           return throttleDefault(async () => {
//             await T.post(`lists/members/create_all`, {
//               screen_name: members,
//               list_id: l,
//               owner_screen_name: person.screenName
//             });
//           })();
//         })
//       );
//     })
//   );
//   logger.info(
//     `Final lists for ${person.screenName} : ${JSON.stringify(
//       mapValues(person.lists, members => members.length)
//     )}`
//   );
//   sendMail(person, <EmailTemplate {...person} />);
//   console.log("Done adding members to list");
// };
