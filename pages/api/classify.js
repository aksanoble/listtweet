import { getSession } from "next-auth/client";
import natural from "natural";
import Twit from "twit";
import jwt from "next-auth/jwt";
import { getLists, getAllTweetsList, getAllFollowing } from "../../queries";
import { classify, addToClassifier } from "../../utils";

export default async (req, res) => {
  const secret = process.env.JWT_SECRET;
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });
  // const lists = await getLists(token);
  // const tweetsByList = await getAllTweetsList(token, [
  //   { id: "1360530779839766528" }
  // ]);
  // const friends = await getAllFollowing(token);
  // addToClassifier(tweetsByList);

  // console.log(lists, "lists");
  // Object.keys(Profiles).forEach(p => {
  //   addToClassifier(Profiles[p].slice(0, 11), classifier);
  // });

  // classifier.train();

  // Object.keys(Profiles).forEach(p => {
  //   classify(Profiles[p].slice(11), classifier);
  // });

  if (!session) {
    res.send({
      error: "You must be sign in to view the protected content on this page."
    });
  } else {
    res.json({
      message: "Hello"
    });
  }
};

// {id: "twitter", name: "Twitter", type: "oauth", signinUrl: "http://localhost:3000/api/auth/signin/twitter", callbackUrl: "http://localhost:3000/api/auth/callback/twitter"}
