import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import SimpleSidebar from "../../components/landing/sidebar";
import HighlightText from "../../components/landing/customs";
import { signIn } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import { unstable_getServerSession } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/router";
import CustomSpinner from "../../components/landing/spinner";

export default function SimpleCard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isDisabled = email === "" || password === "";
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <CustomSpinner
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        extraText={"Welcome back to noterush!"}
      />
      <SimpleSidebar>
        <Flex minH={"100vh"} align={"center"} justify={"center"}>
          <Stack spacing={8} mx={"auto"} w={"2xl"} py={12} px={6}>
            <Stack align={"center"}>
              <Heading fontSize={"4xl"}>
                Sign in to <HighlightText>noterush.</HighlightText>
              </Heading>
              <Text fontSize={"lg"} color={"gray.600"}>
                Welcome back, player!
              </Text>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <Stack spacing={4}>
                <FormControl id="email">
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={(v) => setEmail(v.target.value)}
                  />
                </FormControl>
                <FormControl id="password">
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    onChange={(v) => setPassword(v.target.value)}
                  />
                </FormControl>
                <Stack spacing={10}>
                  <Button
                    loadingText="Submitting"
                    size="lg"
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    disabled={isDisabled}
                    onClick={async () => {
                      onOpen();
                      const status = await signIn("credentials", {
                        redirect: false,
                        email: email,
                        password: password,
                      }).then((e) => {
                        if (e.ok) {
                          router.push("/");
                        } else {
                          onClose();
                          alert(e.error);
                        }
                      });
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Flex>
      </SimpleSidebar>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  try {
    await clientPromise;

    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}
