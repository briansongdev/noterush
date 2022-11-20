// pages/_app.js
import { ChakraProvider, Fade, ScaleFade, Slide } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/lexend-deca/600.css";
import "../styles.css";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#dff7f6",
      100: "#b1eae8",
      200: "#80dddb",
      300: "#4dcecf",
      400: "#26c3c7",
      500: "#00b9c1",
      600: "#00A9AF",
      700: "#009497",
      800: "#008080",
      900: "#055d57",
    },
  },
  fonts: {
    heading: `'Inter'`,
    body: `'Inter'`,
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    document.fonts
      .load("12px Inter")
      .then(() =>
        document.fonts
          .load("12px Lexend Deca")
          .then(() =>
            document.fonts
              .load("bold 12px Inter")
              .then(() =>
                document.fonts
                  .load("500 12px Inter")
                  .then(() =>
                    document.fonts
                      .load("600 12px Inter")
                      .then(() => setIsReady(true))
                  )
              )
          )
      );
  }, []);

  return (
    isReady && (
      <SessionProvider session={session}>
        <ChakraProvider theme={theme}>
          <Head>
            <title>noterush</title>
          </Head>
          <Component {...pageProps} />
        </ChakraProvider>{" "}
      </SessionProvider>
    )
  );
}

export default MyApp;
