import { getSession } from "next-auth/client";
import natural from "natural";
import Twit from "twit";
import jwt from "next-auth/jwt";
import {
  getLists,
  getAllTweetsList,
  getAllFollowing,
  getListMembers
} from "../../queries";
import {
  classify,
  addToClassifier,
  processLists,
  createPerson
} from "../../utils";
import sendMail from "../../sendmail";

export default async (req, res) => {
  const secret = process.env.JWT_SECRET;
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (!session) {
    res.send({
      error: "Please sign in"
    });
  } else {
    res.json({
      message: "Hello"
    });
    const person = createPerson(token);
    const withLists = await getLists(person);
    processLists(withLists);
    // const withMembers = await getListMembers(withLists);

    // console.log(listMembers, "ListMembers");

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
  }
};
