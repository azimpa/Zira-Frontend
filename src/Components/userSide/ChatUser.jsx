import React from "react";
import { LeftPanel } from "./Chats/LeftPanel";
import { RightPanel } from "./Chats/RightPanel";
import { Flex } from "@chakra-ui/react";
import Navbar from "./NavBar"
import { setSelectedChatUser } from "../../Redux/userActions";
import { useDispatch } from "react-redux";


export default function ChatUser() {

  const dispatch = useDispatch();

  const handleUserClick = (user) => {
    dispatch(setSelectedChatUser(user));
  };

  return (
    <div>
      <Navbar />
      <Flex h="100vh">
        <LeftPanel onItemClick={handleUserClick} />
        <RightPanel />
      </Flex>
    </div>
  )
}
