import { TimeIcon } from "@chakra-ui/icons";
import { HStack, Text } from "@chakra-ui/react";

export default function Round1({ time }) {
  return (
    <>
      <Text mt="10px">
        Welcome to your match! We'll begin soon - please get your headphones on
        and get ready to answer.
      </Text>
      <HStack fontWeight="bold">
        <TimeIcon />
        <Text>{Math.max(0, time - 120)} seconds remaining</Text>
      </HStack>
    </>
  );
}
