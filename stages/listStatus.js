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

export const listTweets = async person => {
  const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
  const T = getClient(person);
  const ownerScreenName = person.screen_name;
  const lists = person.preLists;
  lists.forEach(l => {
    return throttleDefault(async () => {
      const res = await T.get(`lists/statuses`, {
        list_id: l.id_str,
        owner_screen_name: ownerScreenName,
        include_rts: false
      });
      console.log(res.data.length, "Tweets from List");
    })();
  });
};
