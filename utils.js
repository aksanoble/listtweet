import { values, groupBy, maxBy, isEmpty, get, set, mapValues } from "lodash";
import pThrottle from "p-throttle";
import natural from "natural";
import sendMail from "./sendmail";
import { getListMembers } from "./queries";
import { listTweets } from "./stages/listStatus";
import EmailTmplInvalid from "./emailTemplates/email-template-invalid";
import logger from "./logger";

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
    set(person, `throttle.${path}.${method}`, throttleDefault);
  }
  return person.throttle[path][method];
};
