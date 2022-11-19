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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import CustomSpinner from "../components/landing/spinner";
import HighlightText, { getRank } from "../components/landing/customs";
import { ObjectId } from "mongodb";

export default function Home({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstLoadUser = JSON.parse(user);
  return (
    <>
      <CustomSpinner
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        extraText={"Have a good day, player!"}
      />
      <SimpleSidebar
        name={firstLoadUser.username}
        rank={getRank(firstLoadUser.elo)}
      >
        <Center h="90vh">
          <VStack w="100%">
            <Heading fontSize={"4xl"} marginBottom="20px">
              Welcome, <HighlightText>{firstLoadUser.username}</HighlightText>!
            </Heading>
            <Center alignSelf="center" width="80%">
              <Progress
                colorScheme="teal"
                width="100%"
                height="20px"
                borderRadius="100px"
                backgroundColor="white"
                isAnimated
                hasStripe
                value={(firstLoadUser.exp % 1000) / 10}
              />
            </Center>
            <HStack
              justifyContent="space-between"
              alignSelf="center"
              width="80%"
            >
              <Text color="teal.700" fontWeight="bold">
                Level {Math.floor(firstLoadUser.exp / 1000)}
              </Text>
              <Text color="teal.700" fontWeight="bold">
                {1000 - (firstLoadUser.exp % 1000)} xp to level{" "}
                {Math.ceil(firstLoadUser.exp / 1000)}
              </Text>
            </HStack>
            <SlideFade
              in={true}
              offsetY="100px"
              style={{ width: "90%" }}
              transition={{ enter: { duration: 1 } }}
            >
              <Container
                maxW="100%"
                bg="gray.200"
                borderRadius="15"
                marginTop="20px"
              >
                <Center p={4} minHeight="30vh">
                  <VStack>
                    <Container maxW="container.md" textAlign="center">
                      <Heading size="xl" mb={4} color="gray.700">
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            padding: "0em 0.2em",
                            backgroundImage:
                              "linear-gradient(to bottom, transparent 50%, #008080 50%)",
                          }}
                        >
                          <span id="textGradient">you're a star.</span>
                        </span>
                      </Heading>

                      <Text fontSize="xl" color="gray.500">
                        you're on your way to{" "}
                        <span
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            padding: "0em 0.2em",
                            backgroundImage:
                              "linear-gradient(to bottom, transparent 50%, #008080 50%)",
                          }}
                        >
                          <span id="textGradient">
                            level {Math.ceil(firstLoadUser.exp / 1000)}
                          </span>
                        </span>
                        {"!"} Start a live game by clicking "play."
                      </Text>
                      <Text fontSize="xl" color="gray.500">
                        your current rank is{" "}
                        <span
                          style={{
                            color: getRank(firstLoadUser.elo).color,
                            backgroundColor: "teal",
                            padding: "3px 3px 3px 3px",
                            fontWeight: "700",
                          }}
                        >
                          {getRank(firstLoadUser.elo).name}
                        </span>
                        {"."}
                      </Text>

                      {firstLoadUser.pastMatchIds.length > 0 && (
                        <Text fontSize="xl" color="gray.500">
                          you've played{" "}
                          <span
                            style={{
                              color: "black",
                              fontWeight: "bold",
                              padding: "0em 0.2em",
                              backgroundImage:
                                "linear-gradient(to bottom, transparent 50%, #008080 50%)",
                            }}
                          >
                            <span id="textGradient">
                              {firstLoadUser.pastMatchIds.length}
                            </span>
                          </span>
                          {" games so far."}
                        </Text>
                      )}
                    </Container>
                  </VStack>
                </Center>
              </Container>
            </SlideFade>
            <Button
              variant="solid"
              colorScheme="teal"
              w="15%"
              onClick={() => {
                onOpen();
                signOut();
              }}
            >
              Sign out
            </Button>
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
