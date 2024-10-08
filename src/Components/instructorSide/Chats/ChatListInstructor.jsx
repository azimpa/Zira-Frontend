import React, { useState, useEffect } from "react";
import {
  Avatar,
  HStack,
  Stack,
  Flex,
  Box,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { fetchUserList, fetchUserFromMessage } from "../../../Services/apiUtils";
import { useSelector } from "react-redux";

export function ChatListInstructor({ onItemClick }) {
  const user = useSelector((state) => state.user);
  const userId = user.user.id

  const [userFromMessage, setUserFromMessage] = useState([]);

  console.log(userFromMessage, "userfrom message")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchUserList();
        const userFromMessage = await fetchUserFromMessage(userId);
        const otherUserId = userFromMessage[0].user;
        console.log(otherUserId, "otherUserId")

        const filteredOtherUserArray = userResponse.find((otherUser) => otherUser.id === otherUserId);
        console.log(filteredOtherUserArray, "filteredOtherUserArray")

        setUserFromMessage(filteredOtherUserArray)
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);


  return (
    <Stack spacing="0" pr="1" divider={<StackDivider w="82%" alignSelf="flex-end" />}>
      {userFromMessage && (
        <HStack
          _hover={{ cursor: "pointer", backgroundColor: "#f5f6f6" }}
          py="3"
          onClick={() => {
            onItemClick(userFromMessage);
            console.log("Selected User:", userFromMessage);
          }}
        >
          <Avatar mx="3" name={userFromMessage.name} src={userFromMessage.src} />
          <Box flex="1">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="semibold">{userFromMessage.name}</Text>
                <Text color="gray.500" fontSize="sm">
                  {userFromMessage.message}
                </Text>
              </Box>
            </Flex>
          </Box>
        </HStack>
      )}
    </Stack>
  );
}
