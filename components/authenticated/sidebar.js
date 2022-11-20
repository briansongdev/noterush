import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Divider,
  Center,
  VStack,
  Avatar,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FiHome, FiMenu, FiBarChart2, FiUsers, FiTv } from "react-icons/fi";
import { BsMusicNote } from "react-icons/bs";
import { useRouter } from "next/router";

const LinkItems = [
  { name: "Home", icon: FiHome, url: "home" },
  { name: "Play", icon: BsMusicNote, url: "play" },
  { name: "Watch", icon: FiTv, url: "watch" },
  { name: "Statistics", icon: FiBarChart2, url: "statistics" },
];

export default function SimpleSidebar({ name, rank, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        name={name}
        rank={rank}
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: "21%" }} p="4">
        {children}
      </Box>
    </Box>
  );
}
const SidebarContent = ({ name, rank, onClose, ...rest }) => {
  const router = useRouter();
  return (
    <Box
      bg={"#008080"}
      borderRight="1px"
      color="#bee3f8"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: "21%" }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="8"
        justifyContent="space-between"
        onClick={() => {
          router.push("/");
        }}
      >
        <Text
          fontFamily="Lexend Deca"
          color="white"
          fontSize="4xl"
          fontWeight="600"
          cursor="pointer"
        >
          noterush.
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          h="50"
          fontWeight="500"
          key={link.name}
          icon={link.icon}
          url={link.url}
        >
          {link.name}
        </NavItem>
      ))}
      <Box style={{ position: "absolute", bottom: 10, left: 0 }} w="100%">
        <Center>
          <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(5, 1fr)"
            columnGap={2}
          >
            <GridItem rowSpan={2} colSpan={1}>
              <Avatar
                src="https://us.123rf.com/450wm/kjpargeter/kjpargeter2008/kjpargeter200800202/153916768-clef-music-symbol-on-a-glittery-gold-confetti-background.jpg?ver=6"
                borderWidth="3px"
              />
            </GridItem>
            <GridItem colSpan={4}>
              <Text fontSize="lg" fontWeight="700">
                {name}{" "}
              </Text>
            </GridItem>
            <GridItem colSpan={4}>
              <Text fontSize="sm">
                <span
                  style={{
                    fontWeight: "bold",
                    color: rank ? rank.color : "#bee3f8",
                  }}
                  id={rank.color == "" ? "highRankIcon" : ""}
                >
                  {rank && rank.name} {rank && rank.eloPoints + "/200"}
                </span>
              </Text>
            </GridItem>
          </Grid>
        </Center>
      </Box>
    </Box>
  );
};

const NavItem = ({ url, icon, children, ...rest }) => {
  const router = useRouter();
  const { asPath } = useRouter();
  return (
    <Link
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onClick={() => {
        if (asPath != "/" + url) {
          router.push("/" + url);
        }
      }}
    >
      {asPath == "/" + url ? (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          color="#00292a"
          _hover={{
            bg: "rgba(0, 169, 175, 0.6)",
            transition: "0.3s",
          }}
          {...rest}
        >
          {icon && <Icon mr="4" fontSize="24" as={icon} />}
          {children}
        </Flex>
      ) : (
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: "rgba(0, 169, 175, 0.6)",
            transition: "0.3s",
          }}
          {...rest}
        >
          {icon && <Icon mr="4" fontSize="24" as={icon} />}
          {children}
        </Flex>
      )}
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
  return (
    <Flex
      ml={{ base: 0, md: "21%" }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontWeight="bold">
        noterush
      </Text>
    </Flex>
  );
};
