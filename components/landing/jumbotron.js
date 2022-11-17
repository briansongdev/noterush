import {
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Jumbotron({ isConnected }) {
  return (
    <Container maxW="100%" bg="gray.200" borderRadius="15">
      <Center p={4} minHeight="50vh">
        <VStack>
          <Container maxW="container.md" textAlign="center">
            <Heading size="2xl" mb={4} color="gray.700">
              Practicing your pitch? No, compete with it!
            </Heading>

            <Text fontSize="xl" color="gray.500">
              NoteRush is the up-and-coming app to pit players against each
              other in a battle for better pitch. Train your ears while feeling
              the glory of victory.
            </Text>

            <Button
              mt={8}
              colorScheme="brand"
              onClick={() => {
                window.open("https://launchman.cc", "_blank");
              }}
            >
              Discover how it works →
            </Button>
            {/* <Text my={2} fontSize="sm" color="gray.500">
          {!(isConnected && totalUsers > 0)
            ? totalUsers + "+ builders have signed up in the last 30 days"
            : ""}
        </Text> */}
          </Container>
        </VStack>
      </Center>
    </Container>
  );
}
