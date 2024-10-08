import React from "react";
import { LeftPanelInstructor } from "./Chats/LeftPanelInstructor";
import { RightPanelInstructor } from "./Chats/RightPanelInstructor";
import { Flex } from "@chakra-ui/react";
import { setSelectedChatUser } from "../../Redux/userActions";
import { useDispatch } from "react-redux";


export default function ChatInstructor() {

  const dispatch = useDispatch();

  const handleUserClick = (user) => {
    dispatch(setSelectedChatUser(user));
  };

  return (
    <div>
      <Flex h="100vh">
        <LeftPanelInstructor onItemClick={handleUserClick} />
        <RightPanelInstructor />
      </Flex>
    </div>
  )
}
