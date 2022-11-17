import Head from "next/head";
import clientPromise from "../lib/mongodb";
import Jumbotron from "../components/landing/jumbotron";
import SimpleSidebar from "../components/landing/sidebar";
import { Container, Text, Center } from "@chakra-ui/react";

export default function Home({ isConnected, totalUsers }) {
  return (
    <>
      <Head>
        <title>NoteRush</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SimpleSidebar>
        <Jumbotron />
      </SimpleSidebar>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    await clientPromise;
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands

    let totalUsers = 0;
    const client = await clientPromise;
    const db = client.db("noterush");
    await db
      .collection("stats")
      .findOne({})
      .then((res) => {
        totalUsers = res.users;
      });
    return {
      props: { isConnected: true, users: totalUsers },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false, users: -1 },
    };
  }
}
