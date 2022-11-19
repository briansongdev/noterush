import {
  Button,
  Center,
  Container,
  Heading,
  SlideFade,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Jumbotron({ currUsers }) {
  console.log(currUsers);
  return (
    <SlideFade
      in={true}
      offsetY="100px"
      style={{ width: "90%" }}
      transition={{ enter: { duration: 1 } }}
    >
      <Container maxW="100%" bg="gray.200" borderRadius="15">
        <Center p={4} minHeight="50vh">
          <VStack>
            <Container maxW="container.md" textAlign="center">
              <Heading size="2xl" mb={4} color="gray.700">
                <span
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    padding: "0em 0.2em",
                    backgroundImage:
                      "linear-gradient(to bottom, transparent 50%, #008080 50%)",
                  }}
                >
                  <span id="textGradient">better pitch wins.</span>
                </span>
              </Heading>

              <Text fontSize="2xl" color="gray.500">
                <span style={{ color: "teal", fontWeight: "700" }}>
                  noterush
                </span>{" "}
                is an exciting game where players engage in a{" "}
                <span
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    padding: "0em 0.2em",
                    backgroundImage:
                      "linear-gradient(to bottom, transparent 50%, #008080 50%)",
                  }}
                >
                  <span id="textGradient">battle for better pitch</span>
                </span>
                {". "}
                Train your ears and feel the{" "}
                <span
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    padding: "0em 0.2em",
                    backgroundImage:
                      "linear-gradient(to bottom, transparent 50%, #008080 50%)",
                  }}
                >
                  <span id="textGradient">glory of victory</span>
                </span>
                .
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
              <Text my={2} fontSize="sm" color="gray.500">
                {currUsers > 0
                  ? currUsers + "+ players waiting for you to join"
                  : ""}
              </Text>
            </Container>
          </VStack>
        </Center>
      </Container>
    </SlideFade>
  );
}
