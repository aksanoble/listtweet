import { getSession } from "next-auth/client";
import logger from "../../logger";
import jwt from "next-auth/jwt";
import { getAllConnections } from "../../queries";
import { createPerson } from "../../utils";

export default async (req, res) => {
  const secret = process.env.JWT_SECRET;
  const token = await jwt.getToken({ req, secret });
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({
      error: "Please sign in"
    });
  } else {
    const person = await createPerson(token);
    const connections = await getAllConnections(person.id_str);
    res.json(connections);
  }
};
