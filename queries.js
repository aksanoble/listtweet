import Twit from "twit";
import pThrottle from "p-throttle";

const getClient = token => {
  return new Twit({
    consumer_key: process.env.TWITTER_ID,
    consumer_secret: process.env.TWITTER_SECRET,
    access_token: token.accessToken,
    access_token_secret: token.refreshToken
  });
};

export const getLists = async token => {
  const throttleDefault = pThrottle({ limit: 1, interval: 1000 });
  const T = getClient(token);
  const ownerScreenName = token.results.screen_name;

  const lists = await throttleDefault(() => {
    return T.get(`lists/ownerships.json?owner_screen_name=${ownerScreenName}`);
  })();
  return lists.data.lists;
};

export const getAllTweetsList = async (token, lists) => {
  const throttleDefault = pThrottle({ limit: 1, interval: 1000 });
  const T = getClient(token);
  const ownerScreenName = token.results.screen_name;

  let tweetsByList = await Promise.all(
    lists.map(l => {
      return throttleDefault(async () => {
        const res = await T.get(
          `lists/members.json?list_id=${l.id}&owner_screen_name=${ownerScreenName}`
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
  const throttleDefault = pThrottle({ limit: 1, interval: 1000 });
  const T = getClient(token);
  const tweets = await Promise.all(
    users.map(u => {
      return throttleDefault(async () => {
        const res = await T.get(
          `statuses/user_timeline.json?screen_name=${u.screen_name}&tweet_mode=extended`
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
    return getAllFollowing(token, throttle, friends.next_cursor_str, acc);
  }
  return acc;
};
