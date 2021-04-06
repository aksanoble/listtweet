import dotenv from "dotenv";
dotenv.config({
  path: "./.env.local"
});
import { runCypher } from "./queries";

const addAccountCypher = account => {
  if (!account) {
    console.error("No name found in Crawl", account);
    return "";
  }

  const keyQueryUnwindMap = {
    users:
      "unwind $users as user merge (u:Account {id: user.id_str}) set u.screenName = user.screen_name, u.name = user.name, u.image = user.profile_image_url_https, u.json = user.json merge (a)-[:FOLLOWS]->(u)"
  };

  let queryString =
    "merge (a:Account {id: $id_str}) set a.screenName = $screen_name, a.image = $profile_image_url_https, a.name = $name";

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
  console.log(`Adding to Graph ${acc.name}`);
  runCypher(addAccountCypher(acc), acc).then(async data => {
    data.records.forEach(r => {
      // console.log(`${r.get("a")} added to Graph`);
    });
  });
};
