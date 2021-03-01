import Twit from "twit";
import pThrottle from "p-throttle";
import { addToClassifier } from "../utils";
import { getAllFollowing } from "../queries";

export const listTweets = async person => {
  const throttleDefault = pThrottle({ limit: 1, interval: 1500 });
  const T = person.tClient;
  const ownerScreenName = person.screen_name;
  const lists = person.preLists;
  const fetchAndTrain = await Promise.all(
    lists.map(l => {
      return throttleDefault(async () => {
        const res = await T.get(`lists/statuses`, {
          list_id: l.id_str,
          owner_screen_name: ownerScreenName,
          tweet_mode: "extended",
          include_rts: false
        });
        addToClassifier(person, res.data, l.id_str);
        return person;
      })();
    })
  );
  const friends = await getAllFollowing(person);

  console.log(friends.length);
};
