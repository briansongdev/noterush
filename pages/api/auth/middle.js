import clientPromise from "../../../lib/mongodb";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
export default function withDatabase(handler) {
  return async (req, res) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (session) {
      const client = await clientPromise;
      const db = client.db("noterush");
      await db
        .collection("users")
        .findOne({ email: req.body.email })
        .then((u) => {
          if (u) {
            if (u.password == req.body.password) {
              // authenticated
              return handler(req, res, true, u);
            }
          }
        });
    }
    return handler(req, res, false);
  };
}
