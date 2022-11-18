import {
  AlertDialog,
  AlertDialogBody,
  Spinner,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { useRef } from "react";

export default function CustomSpinner({ isOpen, onOpen, onClose, extraText }) {
  const cancelRef = useRef();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              noterush.
            </AlertDialogHeader>

            <AlertDialogBody>
              <span style={{ color: "gray" }}>{extraText}</span>
              <Center>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  m="15px 15px"
                />
              </Center>
            </AlertDialogBody>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
