import clientPromise from "../../../../lib/mongodb";
import withDatabase from "../../auth/middle";

async function remove(req, res, auth, user) {
  if (auth) {
    const client = await clientPromise;
    const db = client.db("noterush");
    if (req.method == "POST") {
      await db
        .collection("queue")
        .deleteOne({
          initiator: user._id,
        })
        .then(() => {
          return res.status(200).json({
            success: true,
          });
        });
    } else if (req.method == "GET") {
    }
  } else {
    return res.status(401).json({ success: false });
  }
}

export default withDatabase(remove);
