import { getSession } from "next-auth/client";
import logger from "../../logger";
import jwt from "next-auth/jwt";
import {
  getLists,
  getAllFollowing,
  createLists,
  addMembersToList,
  makeDistinctList,
  getAllConnections
} from "../../queries";
import { processLists, createPerson, makeLists, nx } from "../../utils";

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
    logger.info(`Started processing for ${person.name}`);
    getAllConnections(person.id_str);
    // createLists(person);
    // makeLists(person);
    // makeDistinctList(person.id_str);
    // addMembersToList(person);
    // console.log(token, "token");
    // getAllFollowing(person);
    // const withLists = await getLists(person);
    // logger.info(`${person.screenName} has ${withLists.preLists.length} lists`);
    // processLists(withLists);
  }
};
