import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/mongodb";
import withDatabase from "../../auth/middle";
import Pusher from "pusher";

export const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true,
});

// body:
// authentication (email, pass)
// updates (guess, must validate it's on current level)

// must add points, change levels if necessary, update time, pusher update, and return object showing updatedGameObj (modified to protect privacy)

const notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

async function hello(req, res, auth, user) {
  if (auth && req.method == "POST") {
    const client = await clientPromise;
    const db = client.db("noterush");
    let gameObj,
      isp1,
      userGuesses = req.body.guess.split(""),
      pointsToAdd = 0,
      pitchInterval;
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
    let guessArr = [];
    if ((new Date(Date.now()) - gameObj.startsAt) / 1000 <= 120) {
      for (let i = 0; i < userGuesses.length; i++) {
        let translatedIndex = notes.findIndex((x) => x == userGuesses[i]);
        guessArr.push((translatedIndex - shift) % notes.length);
        if (
          (translatedIndex - shift) % notes.length ==
          gameObj.roundNotes[
            isp1 ? gameObj.currentRoundp1 - 1 : gameObj.currentRoundp2 - 1
          ][isp1 ? gameObj.currentLevelp1 - 1 : gameObj.currentLevelp1 - 1][i]
        ) {
          // Got the point from p-pitch recognition
          pointsToAdd++;
        }
        if (i > 0) {
          if (
            Math.abs(
              (translatedIndex - shift) % notes.length ==
                gameObj.roundNotes[
                  isp1 ? gameObj.currentRoundp1 - 1 : gameObj.currentRoundp2 - 1
                ][
                  isp1 ? gameObj.currentLevelp1 - 1 : gameObj.currentLevelp1 - 1
                ][i]
            ) == pitchInterval
          ) {
            // Got 2 points from r-pitch recognition
            pointsToAdd += 2;
          }
        } else {
          // Set the pitch interval
          pitchInterval = Math.abs(
            ((translatedIndex - shift) % notes.length) -
              gameObj.roundNotes[
                isp1 ? gameObj.currentRoundp1 - 1 : gameObj.currentRoundp2 - 1
              ][isp1 ? gameObj.currentLevelp1 - 1 : gameObj.currentLevelp1 - 1][
                i
              ]
          );
        }
      }
      // add 1 to levels and, if necessary, rounds
      if (isp1) {
        let newLevel = gameObj.currentLevelp1,
          newRound = gameObj.currentRoundp1;
        if (newLevel >= gameObj.roundNotes[newRound - 1].length) {
          newLevel = 1;
        } else {
          newRound--;
        }
        // is done with all levels?
        await db.collection("games").updateOne(
          { _id: ObjectId(user.currentMatch) },
          {
            $set: {
              time1: 120 - (new Date(Date.now()) - gameObj.startsAt) / 1000,
              currentRoundp1: newRound,
              currentLevelp1: newLevel,
            },
            $inc: {
              score1: pointsToAdd,
            },
            $push: {
              p1Guesses: guessArr,
            },
          }
        );
        if (newRound < gameObj.roundNotes.length) {
          let updatedObj = {
            timeLeft: Math.floor(
              120 - (new Date(Date.now()) - gameObj.startsAt) / 1000
            ),
            round: newRound,
            level: newLevel,
            score: gameObj.score1 + pointsToAdd,
            changeInScore: pointsToAdd,
          };
          const response = await pusher.trigger(
            gameObj.player1.toString(),
            "game-updates",
            {
              isPlayer1: isp1,
              isFinished: false,
              timeLeft: Math.floor(
                120 - (new Date(Date.now()) - gameObj.startsAt) / 1000
              ),
              score: gameObj.score1 + pointsToAdd,
              changeInScore: pointsToAdd,
              round: newRound,
              level: newLevel,
            }
          );
          return res.status(200).json({
            success: true,
            finished: false,
            game: updatedObj,
          });
        } else {
          // done with all levels
          await db.collection("games").updateOne(
            { _id: ObjectId(user.currentMatch) },
            {
              $set: {
                p1Done: true,
              },
              $inc: {
                score1: Math.floor(
                  120 - (new Date(Date.now()) - gameObj.startsAt) / 2000
                ),
              },
            }
          );
          const response = await pusher.trigger(
            gameObj.player1.toString(),
            "game-updates",
            {
              isPlayer1: isp1,
              isFinished: true,
              score: gameObj.score2 + pointsToAdd,
              changeInScore: pointsToAdd,
            }
          );
          return res.status(200).json({
            success: true,
            finished: true,
            score: gameObj.score2 + pointsToAdd,
            changeInScore: pointsToAdd,
          });
        }
      } else {
        let newLevel = gameObj.currentLevelp2,
          newRound = gameObj.currentRoundp2;
        if (newLevel >= gameObj.roundNotes[newRound - 1].length) {
          newLevel = 1;
        } else {
          newRound--;
        }
        // is done with all levels?
        await db.collection("games").updateOne(
          { _id: ObjectId(user.currentMatch) },
          {
            $set: {
              time1: 120 - (new Date(Date.now()) - gameObj.startsAt) / 1000,
              currentRoundp2: newRound,
              currentLevelp2: newLevel,
            },
            $inc: {
              score2: pointsToAdd,
            },
            $push: {
              p2Guesses: guessArr,
            },
          }
        );
        if (newRound < gameObj.roundNotes.length) {
          let updatedObj = {
            timeLeft: Math.floor(
              120 - (new Date(Date.now()) - gameObj.startsAt) / 1000
            ),
            round: newRound,
            level: newLevel,
            score: gameObj.score2 + pointsToAdd,
            changeInScore: pointsToAdd,
          };
          const response = await pusher.trigger(
            gameObj.player1.toString(),
            "game-updates",
            {
              isPlayer1: isp1,
              isFinished: false,
              timeLeft: Math.floor(
                120 - (new Date(Date.now()) - gameObj.startsAt) / 1000
              ),
              score: gameObj.score2 + pointsToAdd,
              changeInScore: pointsToAdd,
              round: newRound,
              level: newLevel,
            }
          );
          return res.status(200).json({
            success: true,
            finished: false,
            game: updatedObj,
          });
        } else {
          // done with all levels
          await db.collection("games").updateOne(
            { _id: ObjectId(user.currentMatch) },
            {
              $set: {
                p2Done: true,
              },
              $inc: {
                score2: Math.floor(
                  120 - (new Date(Date.now()) - gameObj.startsAt) / 2000
                ),
              },
            }
          );
          const response = await pusher.trigger(
            gameObj.player1.toString(),
            "game-updates",
            {
              isPlayer1: isp1,
              isFinished: true,
              score: gameObj.score2 + pointsToAdd,
              changeInScore: pointsToAdd,
            }
          );
          return res.status(200).json({
            success: true,
            finished: true,
            score: gameObj.score2 + pointsToAdd,
            changeInScore: pointsToAdd,
          });
        }
      }
    } else {
      return res.status(401).json({ success: false });
    }
  } else {
    return res.status(401).json({ success: false });
  }
}

export default withDatabase(hello);
