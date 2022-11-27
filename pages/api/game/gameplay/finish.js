import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import withDatabase from "../../auth/middle";

async function hello(req, res, auth, user) {
  if (auth && req.method == "POST") {
    const client = await clientPromise;
    const db = client.db("noterush");
    await db
      .collection("games")
      .findOne({
        _id: ObjectId(user.currentMatch),
      })
      .then((game) => {
        gameObj = game;
        if (game.player1 == user._id) isp1 = true;
        else isp1 = false;
      });
    if (
      (new Date(Date.now()) - gameObj.startsAt) / 1000 > 120 ||
      (gameObj.p1Done && gameObj.p2Done)
    ) {
      if (gameObj.active) {
        // This player is faster to end the game ==> end it
        await db.collection("games").updateOne(
          { _id: ObjectId(user.currentMatch) },
          {
            $set: {
              active: false,
            },
          }
        );
        // apply elo updates and currentMatch updates to user object
        let eloChangeP1 = 30,
          eloChangeP2 = 30;
        if (gameObj.score1 > gameObj.score2) {
          eloChangeP1 += Math.floor((gameObj.score1 - gameObj.score2) / 5);
          eloChangeP2 += Math.floor((gameObj.score1 - gameObj.score2) / 5);
          eloChangeP2 *= -1;
        } else {
          eloChangeP1 += Math.floor((gameObj.score2 - gameObj.score1) / 5);
          eloChangeP2 += Math.floor((gameObj.score2 - gameObj.score1) / 5);
          eloChangeP1 *= -1;
        }
        await db.collection("users").updateOne(
          { _id: user._id },
          {
            $set: {
              currentMatch: "",
            },
            $addToSet: {
              pastMatchIds: user.currentMatch,
            },
            $inc: {
              exp: 480 + (isp1 ? gameObj.score1 * 5 : gameObj.score2 * 5),
              elo: isp1 ? eloChangeP1 : eloChangeP2,
            },
          }
        );
        await db.collection("users").updateOne(
          { _id: isp1 ? gameObj.player2 : gameObj.player1 },
          {
            $set: {
              currentMatch: "",
            },
            $addToSet: {
              pastMatchIds: user.currentMatch,
            },
            $inc: {
              exp: 480 + (isp1 ? gameObj.score1 * 5 : gameObj.score2 * 5),
              elo: isp1 ? eloChangeP1 : eloChangeP2,
            },
          }
        );
      }
    } else {
      return res.status(200).json({ success: true, firstInitiator: false });
    }
  } else {
    return res.status(401).json({ success: false });
  }
}

export default withDatabase(hello);
