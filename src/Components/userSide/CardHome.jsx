import React from 'react';
import { Flex, Box, Image, Text, Heading } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

export default function CardHome({ courses }) {
    const navigate = useNavigate();

    const navigateToChapters = (courseId) => {
        navigate(`/chapters?courseId=${courseId}`);
    };

    return (
        <Box mb={8}>
            <Flex alignItems="center" direction="column" p={5}>
                <Heading fontSize={{ base: "2xl", md: "3xl" }} mb={4}>
                    COURSES
                </Heading>
                <Text fontWeight="bold" color="teal">Recommended for you</Text>
            </Flex>
            <Flex align="center" justify="center" flexWrap="wrap">
                {courses.map((course, index) => (
                    <Box
                        key={index}
                        w={{ base: "90%", sm: "45%", md: "30%", lg: "20%" }}
                        borderRadius="xl"
                        overflow="hidden"
                        boxShadow="md"
                        m={4}
                        bg="white"
                        onClick={() => navigateToChapters(course.id)}
                        _hover={{
                            cursor: "pointer",
                            transform: "scale(1.05)",
                            transition: "transform 0.3s ease",
                            boxShadow: "xl",
                        }}
                        style={{ transition: "box-shadow 0.3s ease" }}
                    >
                        <Image
                            src={course.image}
                            alt={course.title}
                            boxSize="100%"
                            objectFit="cover" // Changed to 'cover' for better image fit
                            borderTopRadius="xl"
                            h={{ base: "150px", md: "200px" }} // Adjusted height for responsiveness
                        />
                        <Box p={4} minHeight="180px"> {/* Changed to minHeight to avoid clipping content */}
                            <Text fontSize="lg" fontWeight="bold" mb={2} color="teal.600" textAlign="center">{course.title}</Text>
                            <Text fontSize="sm" color="gray.600" textAlign="center" noOfLines={{ base: 3, md: 4 }}>{course.description}</Text>
                        </Box>
                    </Box>
                ))}
            </Flex>
        </Box>
    );
}
