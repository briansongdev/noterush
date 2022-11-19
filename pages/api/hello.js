// import clientPromise from "../../../../lib/mongodb";
// import withDatabase from "../../auth/middle";

async function hello(req, res, auth, user) {
  if (auth) {
    const client = await clientPromise;
    const db = client.db("noterush");
    if (req.method == "POST") {
    } else if (req.method == "GET") {
    }
  } else {
    return res.status(401).json({ success: false });
  }
}

export default withDatabase(hello);
