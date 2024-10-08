import React, { useEffect, useState } from "react";
import {
    Box,
    Flex,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Text,
    Center,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
import { fetchChapters, fetchCourses } from "../../Services/apiUtils";

export default function ChapterAdmin() {
    const [courses, setCourses] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get("courseId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const chaptersData = await fetchChapters();
                const coursesData = await fetchCourses();
                setChapters(chaptersData);
                setCourses(coursesData);
            } catch (error) {
                console.error("Error fetching Data", error);
            }
        };

        fetchData();
    }, [chapters]);

    const filteredChapters = chapters.filter((ch) => ch.course === parseInt(courseId));

    const handleViewClick = (videoUrl) => {
        setSelectedVideo(videoUrl);
        onOpen();
    };

    return (
        <>
            <Box as="section" minH="100vh">
                {/* SideBarIns */}
                <SideBar />
                <Flex
                    as="header"
                    align="center"
                    w="full"
                    px="4"
                    d={{ base: "flex", md: "none" }}
                    bg="white"
                    justifyContent={{ base: "space-between", md: "flex-end" }}
                    boxShadow="lg"
                    h="12"
                >
                    {/* Additional header content can be added here if needed */}
                </Flex>

                <Box p={2} ml="48">
                    <Box
                        bg="white"
                        borderRadius="lg"
                        p={5}
                        boxShadow="lg"
                    >
                        <Text textAlign="center" fontSize="3xl" color="teal.500" fontWeight="bold">
                            CHAPTER MANAGEMENT
                        </Text>
                        <Center>
                            <Box m={4} w="100%" borderRadius="md">
                                <Table variant="simple" size="sm" colorScheme="teal">
                                    <Thead>
                                        <Tr>
                                            <Th textAlign="center">ID</Th>
                                            <Th textAlign="center">Image</Th>
                                            <Th textAlign="center">Course</Th>
                                            <Th textAlign="center">Chapter Name</Th>
                                            <Th textAlign="center">Content</Th>
                                            <Th textAlign="center">Video</Th>
                                            <Th textAlign="center">Duration</Th>
                                            <Th textAlign="center">Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredChapters.map((chapter) => (
                                            <Tr key={chapter.id}>
                                                <Td textAlign="center">{chapter.id}</Td>
                                                <Td><img src={chapter.image} style={{ maxWidth: "50px" }} /></Td>
                                                <Td textAlign="center">{courses.find(course => course.id === chapter.course)?.title}</Td>
                                                <Td textAlign="center">{chapter.name}</Td>
                                                <Td textAlign="center">{chapter.content}</Td>
                                                <Td textAlign="center">
                                                    <Button
                                                        size="xs"
                                                        bgColor="peru"
                                                        color="white"
                                                        _hover={{ bgColor: "pink.700" }}
                                                        onClick={() => handleViewClick(chapter.video)}
                                                    >
                                                        VIEW
                                                    </Button>
                                                </Td>
                                                <Td textAlign="center">{chapter.duration}</Td>
                                                <Td textAlign="center">{chapter.is_active ? 'Active' : 'Blocked'}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </Center>
                    </Box>
                </Box>

                {/* Modal for Video */}
                <Modal isOpen={isOpen} onClose={onClose} size="xl">
                    <ModalOverlay />
                    <ModalContent borderRadius="md" bg="white">
                        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" color="teal.500">
                            Chapter Video
                        </ModalHeader>
                        <ModalCloseButton color="gray.500" />
                        <ModalBody>
                            {selectedVideo ? (
                                <Box borderRadius="md" overflow="hidden">
                                    <video width="100%" controls>
                                        <source src={selectedVideo} type="video/mp4" />
                                    </video>
                                </Box>
                            ) : (
                                <Text textAlign="center" color="gray.500">No video available</Text>
                            )}
                        </ModalBody>
                        <ModalFooter justifyContent="center">
                            <Button colorScheme="teal" onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </>
    );
}
