import Head from "next/head";
import clientPromise from "../lib/mongodb";
import SimpleSidebar from "../components/authenticated/sidebar";
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
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import CustomSpinner from "../components/landing/spinner";
import HighlightText, { getRank } from "../components/landing/customs";
import { ObjectId } from "mongodb";
import axios from "axios";
import Pusher from "pusher-js";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { Howl } from "howler";

export default function Home({ user }) {
  const [inQueue, setQueueStatus] = useState(false);
  const toast = useToast();
  const firstLoadUser = JSON.parse(user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const rankObj = getRank(firstLoadUser.elo);

  useEffect(() => {
    return async function unsub() {
      // Removes user from queue (if any)
      if (inQueue) {
        await axios.post("/api/game/queue/remove", {
          email: firstLoadUser.email,
          password: firstLoadUser.password,
        });
        toast.closeAll();
      }
    };
  });

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
    const channel = pusher.subscribe(firstLoadUser._id);
    channel.bind("opponent-found", function (data) {
      sound1.play();
      onOpen();
      setTimeout(() => router.push("/game"), 1000);
    });
    return () => {
      pusher.unsubscribe(firstLoadUser._id);
    };
  }, []);

  return (
    <>
      <CustomSpinner
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        extraText={"Match found. Loading you in..."}
      />
      <SimpleSidebar name={firstLoadUser.username} rank={rankObj}>
        <Center h="90vh">
          <VStack w="100%">
            <Heading fontSize={"4xl"} marginBottom="20px">
              <HighlightText>{firstLoadUser.username}</HighlightText>
            </Heading>
            <Heading fontSize={"2xl"}>
              Your cumulative rating is currently{" "}
              <span style={{ color: rankObj.color }}>{firstLoadUser.elo}.</span>
            </Heading>
            <Progress
              sx={{
                "& > div": {
                  background: rankObj.color,
                },
              }}
              width="60%"
              height="20px"
              borderRadius="100px"
              backgroundColor="white"
              value={
                firstLoadUser.elo >= 1200 ? 100 : (firstLoadUser.elo % 200) / 2
              }
            />
            <HStack
              justifyContent="space-between"
              alignSelf="center"
              width="60%"
            >
              <Text color={rankObj.color} fontWeight="bold">
                {rankObj.name}
              </Text>
              <Text color={rankObj.nextRankColor} fontWeight="bold">
                {rankObj.nextRank}
              </Text>
            </HStack>
            <Center alignSelf="center" width="80%">
              <VStack mt="20px" spacing={6}>
                <Button
                  h="200px"
                  w="700px"
                  fontSize="45px"
                  color="white"
                  bgImage="url('./landsca1.jpg')"
                  style={{
                    backgroundPosition: "center -100px",
                    backgroundSize: "cover",
                  }}
                  _hover={{
                    opacity: 0.75,
                  }}
                  rightIcon={<ArrowForwardIcon />}
                  onClick={async () => {
                    await axios
                      .post("/api/game/queue/enter", {
                        email: firstLoadUser.email,
                        password: firstLoadUser.password,
                        isRanked: false,
                      })
                      .then((u) => {
                        if (u.status == 401)
                          alert("Problem. Please wait a moment and try again.");
                        else {
                          setQueueStatus(true);
                          if (!u.data.success) {
                            toast.closeAll();
                            toast({
                              duration: null,
                              title: "Queue Update",
                              description:
                                "You currently have a pending match. To leave the queue, close or leave this page.",
                              status: "info",
                              isClosable: false,
                              position: "bottom-right",
                            });
                          } else {
                            toast.closeAll();
                            if (u.data.shouldRedirect) {
                              onOpen();
                              setTimeout(() => router.push("/game"), 1000);
                            } else
                              toast({
                                duration: null,
                                title: "Queue Update",
                                description:
                                  "You're in queue for unranked! It may take time to match you with an opponent.",
                                status: "success",
                                isClosable: false,
                                position: "bottom-right",
                              });
                          }
                        }
                      });
                  }}
                >
                  Queue unrated
                </Button>
                <Button
                  h="200px"
                  w="700px"
                  fontSize="45px"
                  color="white"
                  bgImage="url('./landsca2.jpg')"
                  rightIcon={<ArrowForwardIcon />}
                  style={{
                    backgroundSize: "cover",
                  }}
                  _hover={{
                    opacity: 0.75,
                  }}
                  onClick={async () => {
                    await axios
                      .post("/api/game/queue/enter", {
                        email: firstLoadUser.email,
                        password: firstLoadUser.password,
                        isRanked: true,
                      })
                      .then((u) => {
                        if (u.status == 401)
                          alert("Problem. Please wait a moment and try again.");
                        else {
                          setQueueStatus(true);
                          if (!u.data.success) {
                            toast.closeAll();
                            toast({
                              duration: null,
                              title: "Queue Update",
                              description:
                                "You currently have a pending match. To leave the queue, close or leave this page.",
                              status: "info",
                              isClosable: false,
                              position: "bottom-right",
                            });
                          } else {
                            toast.closeAll();
                            if (u.data.shouldRedirect) {
                              onOpen();
                              setTimeout(() => router.push("/game"), 1000);
                            } else
                              toast({
                                duration: null,
                                title: "Queue Update",
                                description:
                                  "You're in queue for ranked! It may take time to match you with an opponent of similar rank.",
                                status: "success",
                                isClosable: false,
                                position: "bottom-right",
                              });
                          }
                        }
                      });
                  }}
                >
                  Queue ranked
                </Button>
              </VStack>
            </Center>
          </VStack>
        </Center>
      </SimpleSidebar>
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
    let user;
    const client = await clientPromise;
    const db = client.db("noterush");
    await db
      .collection("users")
      .findOne({ _id: ObjectId(session.user.name) })
      .then((res) => {
        user = res;
      });
    user = JSON.stringify(user);
    return {
      props: { user },
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
