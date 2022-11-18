import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import SimpleSidebar from "../../components/landing/sidebar";
import HighlightText from "../../components/landing/customs";
import { useRouter } from "next/router";
import axios from "axios";
import { signIn } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function SignupCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const isDisabled =
    email === "" ||
    password === "" ||
    !(username.length > 0 && username.length <= 15);
  const router = useRouter();
  return (
    <SimpleSidebar>
      <Flex minH={"100vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up for a <HighlightText>noterush</HighlightText> account
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  onChange={(v) => setEmail(v.target.value)}
                />
              </FormControl>
              <FormControl id="firstName" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  onChange={(v) => setUsername(v.target.value)}
                />
                <FormHelperText>Up to 15 characters.</FormHelperText>
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    onChange={(v) => setPassword(v.target.value)}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>
                  Make it something strong and something you can remember.
                </FormHelperText>
              </FormControl>
              <Stack spacing={10} pt={2}>
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
                    await axios
                      .post("/api/auth/account", {
                        username: username,
                        password: password,
                        email: email,
                      })
                      .then(async (res) => {
                        console.log(res.data);
                        if (res.data.success) {
                          const status = await signIn("credentials", {
                            redirect: false,
                            email: email,
                            password: password,
                          }).then((e) => {
                            router.push("/");
                          });
                        } else {
                          alert(res.data.message);
                        }
                      });
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link
                    color={"blue.400"}
                    onClick={() => {
                      router.push("/account/login");
                    }}
                  >
                    Login
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </SimpleSidebar>
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
