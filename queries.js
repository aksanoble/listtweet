import Twit from "twit";
import pThrottle from "p-throttle";
import { processListMembers } from "./utils";

const getClient = token => {
  return new Twit({
    consumer_key: process.env.TWITTER_ID,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.refreshToken
  });
};

export const getLists = async (
  token,
  throttle = pThrottle({ limit: 1, interval: 65000 }),
  cursor = -1,
  acc = []
) => {
  const T = getClient(token);
  const ownerScreenName = token.screen_name;
  const lists = await throttle(() => {
    return T.get(`lists/ownerships`, {
      owner_screen_name: ownerScreenName,
      cursor
    });
  })();
  acc = [...acc, ...lists.data.lists];
  if (lists.data.next_cursor) {
    return getLists(token, throttle, lists.data.next_cursor_str, acc);
  }
  return {
    ...token,
    preLists: acc
  };
};

export const getListMembers = async person => {
  const lists = person.preLists;
  const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
  const T = getClient(person);
  const ownerScreenName = person.screen_name;

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
    acc[lists[index].id_str] = current.slice(0, 1);
    return acc;
  }, {});
  processListMembers({
    ...person,
    membersByList
  });
};

export const getAllTweetsList = async (token, lists) => {
  const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
  const T = getClient(token);
  const ownerScreenName = token.results.screen_name;

  let tweetsByList = await Promise.all(
    lists.map(l => {
      return throttleDefault(async () => {
        const res = await T.get(
          `lists/members?list_id=${l.id}&owner_screen_name=${ownerScreenName}`
        );
        const tweets = await getTweetsAll(token, res.data.users);
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

export const getTweetsAll = async (token, users) => {
  const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
  const T = getClient(token);
  const tweets = await Promise.all(
    users.map(u => {
      return throttleDefault(async () => {
        const res = await T.get(
          `statuses/user_timeline?screen_name=${u.screen_name}&tweet_mode=extended`
        );
        return res.data;
      })();
    })
  );
  return tweets.flat();
};

export const getAllFollowing = async (
  token,
  throttle = pThrottle({ limit: 1, interval: 65000 }),
  cursor = -1,
  acc = []
) => {
  const T = getClient(token);
  const screenName = token.results.screen_name;

  const friends = await throttle(() => {
    return T.get(`friends/list`, { screen_name: screenName, cursor });
  })();
  acc = [...acc, ...friends.data.users];
  if (friends.data.next_cursor) {
    return getAllFollowing(token, throttle, friends.data.next_cursor_str, acc);
  }
  return acc;
};
