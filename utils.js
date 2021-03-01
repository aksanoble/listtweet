import { values, groupBy, maxBy, isEmpty, get, set } from "lodash";
import pThrottle from "p-throttle";
import natural from "natural";
import sendMail from "./sendmail";
import { getListMembers } from "./queries";
import { listTweets } from "./stages/listStatus";
import EmailTmplNoMembers from "./emailTemplates/email-template-no-members";
import EmailTemplate from "./emailTemplates/email-template-html";
import EmailTmplOneMember from "./emailTemplates/email-template-one-member";
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
    console.log(`Adding to Classifier ${user} with ${listId}`);
    classifier.addDocument(bio, listId);
    tweets.forEach(t => {
      classifier.addDocument(tweetText(t), listId);
    });
  }
};

export const classify = (tweets, classifier) => {
  const user = tweets[0].user.screen_name;
  const tag = accountTag[user];
  console.log(`Classifiying Tweets of ${user} with ${tag}`);
  console.log(
    maxBy(
      values(
        groupBy(tweets.map(t => classifier.classify(tweetText(t))))
      ).map(d => ({ name: d[0], count: d.length })),
      o => o.count
    ).name,
    user,
    tag
  );
};

export const processLists = person => {
  if (isEmpty(person.preLists)) {
    sendMail(person, <EmailTemplate {...person} />);
  } else if (person.preLists.length === 1) {
    sendMail(person, <EmailTmplOneMember {...person} />);
  } else {
    getListMembers(person);
  }
};

export const processListMembers = person => {
  const lists = Object.keys(person.membersByList);
  const emptyLists = lists.filter(l => person.membersByList[l].length === 0);

  if (emptyLists.length === lists.length) {
    sendMail(person, <EmailTmplNoMembers {...person} />);
  } else {
    // getTweets
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
    throttle: {}
  };
};

export const getThrottle = (person, path, method) => {
  if (!get(person, `throttle.${path}.${method}`)) {
    const rateLimit = RATE_LIMITS[path][method];
    console.log(`Initialising for person ${person.name}`);
    const throttleDefault = pThrottle({ limit: 1, interval: rateLimit });
    set(person, `throttle.${path}.${method}`, throttleDefault);
  }
  return person.throttle[path][method];
};
