import pThrottle from "p-throttle";
import { classify } from "./utils";
import { chunk, mapValues } from "lodash";
import { processListMembers, getThrottle } from "./utils";
import EmailTemplate from "./emailTemplates/email-template-html";
import logger from "./logger";

import sendMail from "./sendmail";

export const getLists = async (
  person,
  throttle = pThrottle({ limit: 1, interval: 65000 }),
  cursor = -1,
  acc = []
) => {
  console.log(`Fetcing all Lists for ${person.name}`);
  const T = person.tClient;
  const ownerScreenName = person.screen_name;
  const lists = await throttle(() => {
    return T.get(`lists/ownerships`, {
      owner_screen_name: ownerScreenName,
      cursor
    });
  })();
  acc = [...acc, ...lists.data.lists];
  if (lists.data.next_cursor) {
    return getLists(person, throttle, lists.data.next_cursor_str, acc);
  }
  console.log(`Fetched all Lists for ${person.name}`);
  return {
    ...person,
    preLists: acc
  };
};

export const getListMembers = async person => {
  const lists = person.preLists;
  const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
  const T = person.tClient;
  const ownerScreenName = person.screen_name;
  console.log(`Fetching all members of lists for ${person.name}`);
  let listMembers = await Promise.all(
    lists.map(l => {
      return throttleDefault(async () => {
        const res = await T.get(`lists/members`, {
          list_id: l.id_str,
          owner_screen_name: ownerScreenName
        });
        return res.data.users;
      })();
    })
  );

  const membersByList = listMembers.reduce((acc, current, index) => {
    acc[lists[index].id_str] = current;
    return acc;
  }, {});
  processListMembers({
    ...person,
    membersByList
  });
};

export const getAllTweetsList = async (person, lists) => {
  const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
  const T = person.tClient;
  const ownerScreenName = person.screen_name;

  let tweetsByList = await Promise.all(
    lists.map(l => {
      return throttleDefault(async () => {
        const res = await T.get(
          `lists/members?list_id=${l.id}&owner_screen_name=${ownerScreenName}`
        );
        const tweets = await getTweetsAll(person, res.data.users);
        return {
          id: l.id,
          tweets
        };
      })();
    })
  );

  tweetsByList = tweetsByList.reduce((acc, byList) => {
    acc[byList.id] = byList.tweets;
    return acc;
  }, {});

  return tweetsByList;
};

export const getTweetsAll = async (person, users, cursor) => {
  const throttleDefault = getThrottle(person, "statuses/user_timeline", "get");
  const T = person.tClient;
  const tweets = await Promise.all(
    users.map(u => {
      return throttleDefault(async () => {
        const res = await T.get(`statuses/user_timeline`, {
          screen_name: u.screen_name,
          tweet_mode: "extended"
        });
        classify(person, u.screen_name, res.data);
        return res.data;
      })();
    })
  );
  if (!cursor) {
    console.log(`Done classifiying all tweets`);
    addToList(person);
  }
  return tweets.flat();
};

export const getAllFollowing = async (
  person,
  throttle = pThrottle({ limit: 1, interval: 65000 }),
  cursor = -1,
  acc = []
) => {
  const T = person.tClient;
  const screenName = person.screenName;

  const friends = await throttle(() => {
    return T.get(`friends/list`, { screen_name: screenName, cursor });
  })();

  getTweetsAll(person, friends.data.users, friends.data.next_cursor);
  acc = [...acc, ...friends.data.users];
  if (friends.data.next_cursor) {
    return getAllFollowing(person, throttle, friends.data.next_cursor_str, acc);
  }
  return acc;
};

export const addToList = async person => {
  const T = person.tClient;
  const membersByList = person.lists;
  const lists = Object.keys(membersByList);

  const throttleDefault = getThrottle(
    person,
    "lists/members/create_all",
    "post"
  );

  const bulkAdd = await Promise.all(
    lists.map(l => {
      const membersChunked = chunk(membersByList[l], 100);
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
    `Final lists for ${person.screenName} : ${JSON.stringify(
      mapValues(person.lists, members => members.length)
    )}`
  );
  sendMail(person, <EmailTemplate {...person} />);
  console.log("Done adding members to list");
};
