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

const LinkItems = [
  { name: "Home", icon: FiHome },
  { name: "Play", icon: BsMusicNote },
  { name: "Watch", icon: FiTv },
  { name: "Statistics", icon: FiBarChart2 },
  { name: "My profile", icon: FiUsers },
];

export default function SimpleSidebar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
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
const SidebarContent = ({ onClose, ...rest }) => {
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
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text
          fontFamily="Lexend Deca"
          color="white"
          fontSize="4xl"
          fontWeight="600"
        >
          noterush.
        </Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem h="50" fontWeight="500" key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
      {/* <Center mt="10px">
        <VStack w="100%">
          <Divider
            w="70%"
            borderWidth="2px"
            borderColor="white"
            backgroundColor="white"
            borderRadius="15px"
          />
        </VStack>
      </Center> */}
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
                Not logged in{" "}
              </Text>
            </GridItem>
            <GridItem colSpan={4}>
              <Text fontSize="sm">
                <span style={{ fontWeight: "bold" }}>Unranked</span>
              </Text>
            </GridItem>
          </Grid>
        </Center>
      </Box>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
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
        NoteRush
      </Text>
    </Flex>
  );
};
