import Head from "next/head";
import clientPromise from "../lib/mongodb";
import Jumbotron from "../components/landing/jumbotron";
import SimpleSidebar from "../components/landing/sidebar";
import { Container, Text, Center, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

export default function Home({ isConnected }) {
  return (
    <>
      <SimpleSidebar>
        <Center h="90vh">
          <Button
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </Button>
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
    await clientPromise;
    return {
      props: {},
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
