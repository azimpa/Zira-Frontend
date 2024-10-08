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
import { useLocation } from "react-router-dom";

export function ChatList({ onItemClick }) {
  const user = useSelector((state) => state.user);
  const userId = user.user.id

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const instructorId = searchParams.get("instructorId");

  const [userFromUrl, setUserFromUrl] = useState(null);
  const [userFromMessage, setUserFromMessage] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchUserList();
        const filteredUserData = userResponse.find((user) => user.id === parseInt(instructorId));
        console.log(filteredUserData, "filteredUserData");
        setUserFromUrl(filteredUserData);

        const userFromMessage = await fetchUserFromMessage(userId);
        const otherUserId = userFromMessage[0].other_user;
        console.log(otherUserId, "otherUserId");
        const filteredOtherUserArray = userResponse.find((otherUser) => otherUser.id === otherUserId);
        setUserFromMessage(filteredOtherUserArray);
        console.log(userFromUrl, "userFromUrl");
        console.log(userFromMessage, "userfrom message");
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <Stack spacing="0" pr="1" divider={<StackDivider w="82%" alignSelf="flex-end" />}>
      {/* Render user from URL */}
      {userFromUrl && (
        <HStack
          _hover={{ cursor: "pointer", backgroundColor: "#f5f6f6" }}
          py="3"
          onClick={() => {
            onItemClick(userFromUrl);
            console.log("Selected User:", userFromUrl);
          }}
        >
          <Avatar mx="3" name={userFromUrl.name} src={userFromUrl.src} />
          <Box flex="1">
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="semibold">{userFromUrl.name}</Text>
                <Text color="gray.500" fontSize="sm">
                  {userFromUrl.message}
                </Text>
              </Box>
            </Flex>
          </Box>
        </HStack>
      )}

      {userFromMessage && userFromMessage !== userFromUrl && (
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
