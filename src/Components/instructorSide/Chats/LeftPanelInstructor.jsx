import { Box, Flex, Avatar, Text } from "@chakra-ui/react";
import { ChatListInstructor } from "./ChatListInstructor";
import { useSelector } from "react-redux";

export function LeftPanelInstructor({ onItemClick }) {

  const user = useSelector((state) => state.user);

  return (
    <Flex
      direction="column"
      w="30%"
      bgGradient="linear(to-b, #4F6D7A, #1a202c)"
      color="#e2e8f0"
      boxShadow="lg"
      overflow="hidden"
    >
      <Box p="4" borderBottomWidth="1px">
        <Flex align="center">
          <Avatar
            boxSize="40px"
            name="Clara Fiona"
            src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGJsYWNrJTIwZmVtYWxlJTIwaGVhZHNob3R8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
            mr="2"
          />
          <Text fontWeight="bold" fontSize="xl">
            {user.user.name}
          </Text>
        </Flex>
      </Box>
      <Box flex="1" overflowY="auto">
        <ChatListInstructor onItemClick={onItemClick} />
      </Box>
    </Flex>
  );
}
