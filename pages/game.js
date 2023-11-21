import Head from "next/head";
import clientPromise from "../lib/mongodb";
import {
  Container,
  Text,
  Center,
  Button,
  useDisclosure,
  VStack,
  Heading,
  Progress,
  HStack,
  SlideFade,
  Flex,
  Card,
  CardBody,
  Stack,
  CardHeader,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import HighlightText, { getRank } from "../components/landing/customs";
import { ObjectId } from "mongodb";
import axios from "axios";
import Pusher from "pusher-js";
import { Howl } from "howler";
import { TimeIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Round1 from "../components/authenticated/round1";
import Round2 from "../components/authenticated/round2";

export default function Home({ gameObj, userObj }) {
  const go = JSON.parse(gameObj);
  const router = useRouter();
  const [time, setTime] = useState(
    // Math.floor(
    //   Math.max(120 - (new Date(Date.now()) - new Date(go.startsAt)) / 1000, 0)
    // )
    118
  );
  const [round, setRound] = useState(
    go.isp1 ? go.currentRoundp1 : go.currentRoundp2
  );
  const [oppoStats, setOppoStats] = useState({
    isFinished: false,
    isPlayer1: !go.isp1,
    timeLeft: 120,
    score: 0,
    changeInScore: 0,
    round: 1,
    level: 1,
  });
  const gameStage = () => {
    switch (round) {
      case 1:
        return <Round1 time={time} />;
      case 2:
        return <Round2 time={time} go={go} />;
    }
  };
  useEffect(() => {
    const hi = async () => {
      setTimeout(() => setTime((time) => Math.max(time - 1, 118)), 1000);
      if (time <= 120 && round == 1) {
        // move round up to 2
        setRound(2);
      }
      if (time <= 80) {
        setRound(3);
      }
      if (time <= 40) {
        setRound(4);
      }
      if (Math.max(time - 1, 0) <= 0) {
        await axios
          .post("/api/game/gameplay/finish", {
            email: go.email,
            password: go.password,
          })
          .then((res) => {
            if (res.data.success) {
              router.push("/");
            }
          });
      }
    };
    hi();
  }, [time]);
  useEffect(() => {
    let sound1 = new Howl({
      src: [
        "https://assets.mixkit.co/sfx/preview/mixkit-retro-game-notification-212.mp3",
      ],
      html5: true,
      volume: 0.3,
    });
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY, {
      cluster: "us3",
      forceTLS: true,
    });
    const channel = pusher.subscribe(
      go.isp1 ? go.player2.toString() : go.player1.toString()
    );
    channel.bind("game-updates", function (data) {
      sound1.play();
    });
    return () => {
      pusher.unsubscribe(
        go.isp1 ? go.player2.toString() : go.player1.toString()
      );
    };
  }, []);
  return (
    <>
      <Heading m="20px" fontSize={"2xl"} marginBottom="20px">
        <HighlightText>noterush.</HighlightText>
        <br />
        <span
          id={getRank(go.u1rank).color == "" ? "highRankIcon" : ""}
          style={{ color: getRank(go.u1rank).color }}
        >
          {go.u1name} [{go.u1rank}]
        </span>{" "}
        vs.{" "}
        <span
          id={getRank(go.u2rank).color == "" ? "highRankIcon" : ""}
          style={{ color: getRank(go.u2rank).color }}
        >
          {go.u2name} [{go.u2rank}]
        </span>{" "}
        - {go.isRanked ? "Ranked" : "Unrated"}
      </Heading>
      <Center h="85vh">
        <HStack w="95%">
          <VStack w="85%">
            <HStack w="100%" justifyContent="center" m="15px">
              <TimeIcon /> <Text fontSize="xl">{time} seconds left</Text>
              <Progress
                colorScheme="teal"
                width="60%"
                height="20px"
                borderRadius="100px"
                backgroundColor="gray.300"
                isAnimated
                hasStripe
                value={(time * 100) / 120}
              />
            </HStack>
            <Container
              bg="gray.100"
              maxW="80%"
              padding="30px"
              borderRadius="15px"
            >
              <Heading fontSize="2xl" textAlign="center">
                Round {round - 1}: {go.rounds[round - 1]}
              </Heading>

              {gameStage()}
            </Container>
          </VStack>
          <Flex verticalAlign="flex-start" h="80vh" w="15%">
            <Card variant="filled" maxH="60%" w="100%" overflowY="scroll">
              <CardHeader>
                <Heading size="md">YOUR OPPONENT</Heading>
              </CardHeader>
              <CardBody>
                <Stack mt="-6">
                  {!oppoStats.isFinished ? (
                    <>
                      <Text color="blue.600" fontWeight="bold" fontSize="lg">
                        {oppoStats.score}{" "}
                        <span
                          style={{ fontSize: "12px", fontWeight: "normal" }}
                        >
                          points
                        </span>
                      </Text>
                      <Text color="blue.600" fontSize="md" fontWeight="bold">
                        {go.rounds[oppoStats.round - 1]}
                        {" Round"}
                        <br />
                        Level {oppoStats.level}
                      </Text>
                      <Text color="blue.600" fontSize="lg" fontWeight="bold">
                        {oppoStats.timeLeft}{" "}
                        <span
                          style={{ fontSize: "12px", fontWeight: "normal" }}
                        >
                          seconds left
                        </span>
                      </Text>
                      <Text fontSize="xs">
                        The time only updates periodically.
                      </Text>
                    </>
                  ) : (
                    <>
                      <Heading size="sm">{go.u2name}</Heading>
                      <Text color="blue.600" fontWeight="700" fontSize="xl">
                        Finished
                      </Text>
                    </>
                  )}
                </Stack>
              </CardBody>
            </Card>
          </Flex>
        </HStack>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );
    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    let gameObj,
      userObj,
      inGameCheck = true;
    const client = await clientPromise;
    const db = client.db("noterush");
    await db
      .collection("users")
      .findOne({ _id: ObjectId(session.user.name) })
      .then(async (res) => {
        if (res.currentMatch == "") inGameCheck = false;
        else {
          await db
            .collection("games")
            .findOne({ _id: ObjectId(res.currentMatch) })
            .then(async (res1) => {
              gameObj = res1;
              await db
                .collection("users")
                .findOne({
                  _id:
                    res1.player1.toString() == session.user.name
                      ? res1.player2
                      : res1.player1,
                })
                .then((res2) => {
                  (gameObj.u1name = res.username),
                    (gameObj.u2name = res2.username),
                    (gameObj.u1rank = res.elo),
                    (gameObj.u2rank = res2.elo);
                  (gameObj.email = res.email),
                    (gameObj.password = res.password);
                  if (res1.player1.toString() == session.user.name) {
                    gameObj.isp1 = true;
                  } else {
                    gameObj.isp1 = false;
                  }
                });
            });
          gameObj = JSON.stringify(gameObj);
        }
      });
    if (!inGameCheck)
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    return {
      props: { gameObj },
    };
  } catch (e) {
    console.error(e);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
