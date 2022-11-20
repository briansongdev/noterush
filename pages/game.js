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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import CustomSpinner from "../components/landing/spinner";
import HighlightText, { getRank } from "../components/landing/customs";
import { ObjectId } from "mongodb";
import axios from "axios";

export default function Home({ gameObj }) {
  const go = JSON.parse(gameObj);
  return (
    <>
      <Heading m="20px" fontSize={"2xl"} marginBottom="20px">
        <HighlightText>noterush.</HighlightText>{" "}
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
      <Center h="90vh">
        <VStack w="100%">
          <Center alignSelf="center" width="80%">
            <Progress
              colorScheme="teal"
              width="100%"
              height="20px"
              borderRadius="100px"
              backgroundColor="white"
              isAnimated
              hasStripe
              // value={(firstLoadUser.exp % 1000) / 10}
            />
          </Center>
          <HStack justifyContent="space-between" alignSelf="center" width="80%">
            {/* <Text color="teal.700" fontWeight="bold">
              Level {Math.floor(firstLoadUser.exp / 1000)}
            </Text>
            <Text color="teal.700" fontWeight="bold">
              {1000 - (firstLoadUser.exp % 1000)} xp to level{" "}
              {Math.ceil(firstLoadUser.exp / 1000)}
            </Text> */}
          </HStack>
        </VStack>
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
