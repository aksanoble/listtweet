import { values, groupBy, maxBy, isEmpty } from "lodash";
import natural from "natural";
import sendMail from "./sendmail";
import { getListMembers } from "./queries";
import EmailTmplNoMembers from "./email-template-no-members";
import EmailTemplate from "./email-template-html";

export const tweetText = t => {
  if (t.retweeted_status) {
    return t.retweeted_status.full_text;
  }
  return t.full_text;
};

export const addToClassifier = tweetsByList => {
  const classifier = new natural.BayesClassifier();
  Object.keys(tweetsByList).forEach(list => {
    const tweets = tweetsByList[list];
    if (tweets.length > 0) {
      const user = tweets[0].user.screen_name;
      const bio = tweets[0].user.description;
      console.log(`Adding to Classifier ${user} with ${list}`);
      classifier.addDocument(bio, list);
      tweets.forEach(t => {
        classifier.addDocument(tweetText(t), list);
      });
    }
  });
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
  }
};
