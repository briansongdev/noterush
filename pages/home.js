import Head from "next/head";
import clientPromise from "../lib/mongodb";
import SimpleSidebar from "../components/authenticated/sidebar";
import {
  Container,
  Text,
  Center,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import CustomSpinner from "../components/landing/spinner";

export default function Home({ isConnected }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <CustomSpinner
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        extraText={"Have a good day, player!"}
      />
      <SimpleSidebar>
        <Center h="90vh">
          <Button
            onClick={() => {
              onOpen();
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
