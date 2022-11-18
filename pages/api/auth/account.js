import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("noterush");
  if (req.method == "POST") {
    // check valid authentication, if account is already in database
    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    let boolEmail, boolUser;
    await db
      .collection("users")
      .findOne({ email: req.body.email.toLowerCase() })
      .then((u) => {
        if (u) boolEmail = true;
        else boolEmail = false;
      });
    await db
      .collection("users")
      .findOne({ username: req.body.username })
      .then((u) => {
        if (u) boolUser = true;
        else boolUser = false;
      });
    if (
      req.body.email.toLowerCase().match(re) &&
      !boolEmail &&
      !boolUser &&
      req.body.username.length <= 15
    ) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      try {
        // connect to the database
        // add the account
        let newBody = {
          email: req.body.email.toLowerCase(),
          password: hash,
          createdOn: new Date(),
          elo: 0,
          username: req.body.username,
          exp: 1000,
          sheets: 0,
          currentMatch: "",
          pastMatchIds: [],
        };
        let uid = await db.collection("users").insertOne(newBody);
        // return a message
        return res.json({
          uid: uid.insertedId,
          success: true,
        });
      } catch (error) {
        // return an error
        return res.json({
          message: new Error(error).message,
          success: false,
        });
      }
    } else {
      return res.json({
        message:
          "Email is invalidly formatted, or email already exists in database, or username is already taken, or username is greater than 15 characters. Please fix issues and try again.",
        success: false,
      });
    }
  } else if (req.method == "GET") {
    try {
      const token = req.headers["uid"];
      await db
        .collection("users")
        .findOne({ _id: ObjectId(token) })
        .then((u) => {
          res.json(u);
        });
    } catch (e) {
      return res.json(e);
    }
  }
}
