import clientPromise from "../../../../lib/mongodb";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import withDatabase from "../../auth/middle";
import rn from "random-number";
import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

// roundTypes = ["Piano", "Violin, Cello, or Viola"]

const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
const noteGen = rn.generator({
  min: 0,
  max: 11,
  integer: true,
});
const round1Types = ["Piano"]; // Level 1 (3 notes, 1x), 2 (5, 1.1), 3 (7, 1.2), 4 (9, 1.3), 5 (11, 1.5) bonus points
const round2Types = ["Violin", "Viola", "Cello"];
const round3Types = ["Guitar", "Flute", "Trumpet"];
const round4Types = ["Pop", "Electronic"]; // WIP

async function hello(req, res, auth, user) {
  if (auth) {
    const client = await clientPromise;
    const db = client.db("noterush");
    if (req.method == "POST") {
      let alreadyInQueue = true;
      await db
        .collection("queue")
        .findOne({ initiator: user._id })
        .then((u) => {
          if (!u) alreadyInQueue = false;
        });
      if (!alreadyInQueue) {
        if (req.body.isRanked) {
          let foundOppo = true;
          await db
            .collection("queue")
            .findOne({
              ranked: true,
              elo: {
                $gt: user.elo - 200,
                $lt: user.elo + 200,
              },
            })
            .then(async (u) => {
              if (u) {
                await db
                  .collection("games")
                  .insertOne({
                    createdOn: new Date(),
                    startsAt: new Date(Date.now() + 30000),
                    player1: u.initiator,
                    player2: user._id,
                    isRanked: req.body.isRanked,
                    score1: 0,
                    score2: 0,
                    currentRound: 1,
                    rounds: [
                      "Welcome Round",
                      round1Types[0],
                      round2Types[rn({ min: 0, max: 2, integer: true })],
                      round3Types[rn({ min: 0, max: 2, integer: true })],
                      // round4Types[rn({ min: 0, max: 1, integer: true })],
                    ],
                    roundNotes: [
                      [0],
                      [
                        Array.from({ length: 3 }, () => noteGen()),
                        Array.from({ length: 5 }, () => noteGen()),
                        Array.from({ length: 7 }, () => noteGen()),
                        Array.from({ length: 9 }, () => noteGen()),
                        Array.from({ length: 11 }, () => noteGen()),
                      ],
                      [
                        Array.from({ length: 3 }, () => noteGen()),
                        Array.from({ length: 5 }, () => noteGen()),
                        Array.from({ length: 7 }, () => noteGen()),
                        Array.from({ length: 9 }, () => noteGen()),
                        Array.from({ length: 11 }, () => noteGen()),
                      ],
                      [
                        Array.from({ length: 3 }, () => noteGen()),
                        Array.from({ length: 5 }, () => noteGen()),
                        Array.from({ length: 7 }, () => noteGen()),
                        Array.from({ length: 9 }, () => noteGen()),
                        Array.from({ length: 11 }, () => noteGen()),
                      ],
                    ],
                    time1: 120,
                    time2: 120,
                  })
                  .then(async (a) => {
                    await db.collection("users").updateOne(
                      { _id: ObjectId(user._id) },
                      {
                        $set: {
                          currentMatch: a.insertedId.toString(),
                        },
                      }
                    );
                    await db.collection("users").updateOne(
                      { _id: ObjectId(u.initiator) },
                      {
                        $set: {
                          currentMatch: a.insertedId.toString(),
                        },
                      }
                    );
                    await db.collection("queue").deleteOne({
                      initiator: u.initiator,
                    });
                    const response = await pusher.trigger(
                      u.initiator.toString(),
                      "opponent-found",
                      {
                        message: a.insertedId,
                      }
                    );
                    return res.json({
                      success: true,
                      shouldRedirect: true,
                    });
                  });
              } else foundOppo = false;
            });
          if (!foundOppo) {
            await db.collection("queue").insertOne({
              initiator: user._id,
              ranked: true,
              elo: user.elo,
            });
            return res.json({
              success: true,
              shouldRedirect: false,
            });
          }
        } else {
          let foundOppo = true;
          await db
            .collection("queue")
            .findOne({
              ranked: false,
            })
            .then(async (u) => {
              if (u) {
                await db
                  .collection("games")
                  .insertOne({
                    createdOn: new Date(),
                    startsAt: new Date(Date.now() + 30000),
                    player1: u.initiator,
                    player2: user._id,
                    isRanked: req.body.isRanked,
                    score1: 0,
                    score2: 0,
                    currentRound: 1,
                    rounds: [
                      "Welcome Round",
                      round1Types[0],
                      round2Types[rn({ min: 0, max: 2, integer: true })],
                      round3Types[rn({ min: 0, max: 2, integer: true })],
                      // round4Types[rn({ min: 0, max: 1, integer: true })],
                    ],
                    roundNotes: [
                      [0],
                      [
                        Array.from({ length: 3 }, () => noteGen()),
                        Array.from({ length: 5 }, () => noteGen()),
                        Array.from({ length: 7 }, () => noteGen()),
                        Array.from({ length: 9 }, () => noteGen()),
                        Array.from({ length: 11 }, () => noteGen()),
                      ],
                      [
                        Array.from({ length: 3 }, () => noteGen()),
                        Array.from({ length: 5 }, () => noteGen()),
                        Array.from({ length: 7 }, () => noteGen()),
                        Array.from({ length: 9 }, () => noteGen()),
                        Array.from({ length: 11 }, () => noteGen()),
                      ],
                      [
                        Array.from({ length: 3 }, () => noteGen()),
                        Array.from({ length: 5 }, () => noteGen()),
                        Array.from({ length: 7 }, () => noteGen()),
                        Array.from({ length: 9 }, () => noteGen()),
                        Array.from({ length: 11 }, () => noteGen()),
                      ],
                    ],
                    time1: 120,
                    time2: 120,
                  })
                  .then(async (a) => {
                    await db.collection("users").updateOne(
                      { _id: ObjectId(user._id) },
                      {
                        $set: {
                          currentMatch: a.insertedId.toString(),
                        },
                      }
                    );
                    await db.collection("users").updateOne(
                      { _id: ObjectId(u.initiator) },
                      {
                        $set: {
                          currentMatch: a.insertedId.toString(),
                        },
                      }
                    );
                    await db.collection("queue").deleteOne({
                      initiator: u.initiator,
                    });
                    const response = await pusher.trigger(
                      u.initiator.toString(),
                      "opponent-found",
                      {
                        message: a.insertedId,
                      }
                    );
                    return res.json({
                      success: true,
                      shouldRedirect: true,
                    });
                  });
              } else foundOppo = false;
            });
          if (!foundOppo) {
            await db.collection("queue").insertOne({
              initiator: user._id,
              ranked: false,
              elo: user.elo,
            });
            return res.status(200).json({
              success: true,
              shouldRedirect: false,
            });
          }
        }
      } else {
        return res.status(200).json({
          success: false,
          message: "Already in queue.",
        });
      }
    }
  } else {
    return res.status(401).json({ success: false });
  }
}

export default withDatabase(hello);
