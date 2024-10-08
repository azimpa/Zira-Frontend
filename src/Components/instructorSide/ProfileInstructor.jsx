import React from "react";
import {
    Box,
    Flex,
    Avatar,
    VStack,
    Badge,
    Text,
    Button,
} from "@chakra-ui/react";
import SideBarIns from "./SideBarIns";
import { useSelector } from "react-redux";

export default function ProfileInstructor() {
    const instructor = useSelector((state) => state.user);

    // const { isOpen, onOpen, onClose } = useDisclosure()

    console.log(instructor, "instructor details")


    const tutor = {
        name: instructor.user.name,
        expertise: "DSA",
        experience: instructor.user.experience,
        email: instructor.user.email,
        number: instructor.user.contact_number,
        status: instructor.user.is_approved,
        bio:
            "Dedicated Data Structures and Algorithms (DSA) tutor with a fervent commitment to guiding students in mastering key concepts and problem-solving skills. Proven track record in simplifying complex DSA topics, fostering a deep understanding among learners. Committed to empowering students to excel in coding interviews and real-world applications through comprehensive and engaging tutoring sessions.",
        avatarUrl: "https://example.com/avatar.jpg",
    };

    const { name, expertise, bio, avatarUrl, experience, email, number, status } = tutor;

    return (
        <Box as="section" minH="100vh" display="flex">
            {/* Sidebar */}
            <SideBarIns />

            {/* Content Section */}
            <Flex direction="column" flex="1">
                {/* Header */}
                <Flex
                    as="header"
                    align="center"
                    w="full"
                    px="4"
                    bg="white"
                    justifyContent={{ base: "space-between", md: "flex-end" }}
                    boxShadow="lg"
                    h="12"
                >
                    {/* Header content goes here */}
                </Flex>

                {/* Main Content */}
                <Box display="flex" justifyContent="center" alignItems="center" p={10}>
                    <Box
                        maxW="xl"
                        borderRadius="lg"
                        overflow="hidden"
                        p={8}
                        bg="white"
                        boxShadow="lg"
                        display="flex"
                        ml="20%"
                    >
                        <Flex direction="column" align="center" justify="center">
                            <Avatar src={avatarUrl} alt={name} mb={4} boxSize="150px" />

                            <VStack align="center" spacing={2}>
                                <Text fontWeight="bold" fontSize="2xl">
                                    {name}
                                </Text>
                                <Badge colorScheme="green">{expertise}</Badge>
                                <Text>Experience: {experience} Years</Text>
                                <Text>Email ID: {email}</Text>
                                <Text>Contact No: {number}</Text>
                                <Text>Status: {status === true ? "Approved" : "Not Approved"}</Text>
                            </VStack>

                            <Text mt={4} textAlign="center">
                                {bio}
                            </Text>
                            {/* <Button mt={5} colorScheme="teal" variant="solid" >
                                Edit Details
                            </Button> */}
                        </Flex>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}
