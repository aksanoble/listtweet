import { getSession } from "next-auth/client";
import logger from "../../logger";
import jwt from "next-auth/jwt";
import { toFetchNetwork } from "../../queries";
import { createPerson } from "../../utils";

export default async (req, res) => {
  const secret = process.env.JWT_SECRET;
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (!session) {
    res.send({
      error: "Please sign in"
    });
  } else {
    const person = createPerson(token);
    logger.info(`Started processing for ${person.name}`);
    const status = await toFetchNetwork(person);
    console.log("Status to send", status);
    res.json({
      status
    });
  }
};
