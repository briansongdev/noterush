import { RepeatClockIcon } from "@chakra-ui/icons";
import {
  Button,
  Heading,
  HStack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Soundfont from "soundfont-player";

export default function Round2({ time, go }) {
  const [level, setLevel] = useState(
    go.isp1 ? go.currentLevelp1 : go.currentLevelp2
  );
  const speed = [1, 1.2, 1.5];
  const numNotes = [3, 5, 5];
  const notes = [
    "A4",
    "A#4",
    "B4",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "E4",
    "F4",
    "F#4",
    "G4",
    "G#4",
  ];
  const [currGuess, setCurrGuess] = useState("");
  const [isDoneRound, setDoneRound] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const renderCurrGuess = () => {
    if (currGuess != "") {
      const guessToArray = currGuess.trim().split(" ");
      return guessToArray.map((element) => {
        return <Button colorScheme="blackAlpha">{element}</Button>;
      });
    }
  };
  return (
    <>
      <Heading fontSize="lg" textAlign="center">
        Level {level}: {numNotes[level - 1]} notes play at {speed[level - 1]}x
        speed
      </Heading>
      {!isDoneRound ? (
        <VStack fontWeight="bold" mt="20px">
          <Button
            colorScheme="teal"
            onClick={() => {
              const ac = new AudioContext();
              Soundfont.instrument(
                ac,
                go.rounds[1].toLowerCase() == "piano"
                  ? "acoustic_grand_piano"
                  : go.rounds[1].toLowerCase()
              ).then(function (instr) {
                let scheduledNotes = [];
                for (let i = 0; i < go.roundNotes[1][level - 1].length; i++) {
                  scheduledNotes.push({
                    time: (i * 0.7) / speed[level - 1],
                    note: notes[
                      (go.roundNotes[1][level - 1][i] + go.shift) % notes.length
                    ],
                  });
                }
                instr.schedule(ac.currentTime, scheduledNotes);
              });
            }}
          >
            Click to hear notes (level {level})
          </Button>
          <Text>Click notes in the correct order.</Text>
          <HStack width="100%">
            <Button
              colorScheme="blackAlpha"
              onClick={() => {
                setCurrGuess(currGuess + "A ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              A
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setCurrGuess(currGuess + "A# ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              A#/Bb
            </Button>
            <Button
              colorScheme="orange"
              onClick={() => {
                setCurrGuess(currGuess + "B ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              B
            </Button>
            <Button
              colorScheme="yellow"
              onClick={() => {
                setCurrGuess(currGuess + "C ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              C
            </Button>
            <Button
              colorScheme="whatsapp"
              onClick={() => {
                setCurrGuess(currGuess + "C# ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              C#/Db
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                setCurrGuess(currGuess + "D ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              D
            </Button>
            <Button
              colorScheme="teal"
              onClick={() => {
                setCurrGuess(currGuess + "D# ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              D#/Eb
            </Button>
            <Button
              colorScheme="cyan"
              onClick={() => {
                setCurrGuess(currGuess + "E ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              E
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                setCurrGuess(currGuess + "F ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              F
            </Button>
            <Button
              colorScheme="facebook"
              onClick={() => {
                setCurrGuess(currGuess + "F# ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              F#/Gb
            </Button>
            <Button
              colorScheme="purple"
              onClick={() => {
                setCurrGuess(currGuess + "G ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              G
            </Button>
            <Button
              colorScheme="pink"
              onClick={() => {
                setCurrGuess(currGuess + "G# ");
              }}
              disabled={
                currGuess.trim().split(" ").length >= numNotes[level - 1]
              }
              width="80px"
            >
              G#/Ab
            </Button>
          </HStack>
          <Text>Your guess so far: </Text>
          <HStack>
            {renderCurrGuess()}{" "}
            <Button
              colorScheme="red"
              onClick={() => {
                setCurrGuess("");
              }}
              leftIcon={<RepeatClockIcon />}
            >
              Reset guess
            </Button>
          </HStack>
          <Button
            size="lg"
            colorScheme="teal"
            minWidth="200px"
            disabled={currGuess.trim().split(" ").length != numNotes[level - 1]}
            onClick={async () => {
              let reqBody = {
                email: go.email,
                password: go.password,
                guess: currGuess.trim(),
              };
              await axios
                .post("/api/game/gameplay/guess", reqBody)
                .then((res) => {
                  if (!res.data.success) {
                    alert("Error. Sending you back to the home screen.");
                    router.push("/");
                  }
                  toast.closeAll();
                  toast({
                    duration: 2000,
                    title: "Moving on!",
                    description:
                      "You earned " +
                      res.data.game.changeInScore +
                      " points. Total score: " +
                      res.data.game.score,
                    status: "info",
                    isClosable: false,
                    position: "bottom-right",
                  });
                  setLevel(res.data.game.level);
                  setCurrGuess("");
                  if (res.data.game.round != 1) {
                    setLevel(0);
                    setDoneRound(true);
                  }
                });
            }}
          >
            Submit level {level}
          </Button>
        </VStack>
      ) : (
        <VStack>
          <Text>
            All levels have been completed in round 1. Sit tight and prepare for
            the next round!
          </Text>
        </VStack>
      )}
    </>
  );
}
