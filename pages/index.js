import Head from "next/head";
import clientPromise from "../lib/mongodb";
import Jumbotron from "../components/landing/jumbotron";
import SimpleSidebar from "../components/landing/sidebar";
import { Container, Text, Center } from "@chakra-ui/react";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";

export default function Home({ isConnected, users }) {
  return (
    <>
      <SimpleSidebar>
        <Center h="90vh">
          <Jumbotron currUsers={users} />
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
    if (session) {
      return {
        redirect: {
          destination: "/home",
          permanent: false,
        },
      };
    }
    await clientPromise;
    let users = 0;
    const client = await clientPromise;
    const db = client.db("noterush");
    await db
      .collection("stats")
      .findOne({})
      .then((res) => {
        users = res.users;
      });
    return {
      props: { isConnected: true, users: users },
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
