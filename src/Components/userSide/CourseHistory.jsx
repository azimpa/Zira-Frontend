import React, { useEffect, useState } from 'react';
import { Box, Heading, UnorderedList, ListItem, Text, Flex, Badge, Divider } from '@chakra-ui/react';
import Navbar from './NavBar';
import SidebarUser from './SidebarUser';
import { useSelector } from 'react-redux';
import { fetchCategories, fetchInstructorList, fetchPaymentDetails } from '../../Services/apiUtils';
import { useNavigate } from 'react-router-dom';

const CourseHistory = () => {
    const { courses, loading, error } = useSelector(state => state.course);
    const user = useSelector(state => state.user);
    const userId = user.user.id
    const navigate = useNavigate();

    const [instructors, setInstructors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryData, instructorData, paymentData] = await Promise.all([
                    fetchCategories(),
                    fetchInstructorList(),
                    fetchPaymentDetails(userId),
                ]);
                setCategories(categoryData);
                setInstructors(instructorData);
                setPaymentDetails(paymentData);

            } catch (error) {
                console.error("Error fetching Data", error);
            }
        };
        fetchData();
    }, [courses, paymentDetails]);

    const navigateToChapters = (courseId) => {
        navigate(`/chapters?courseId=${courseId}`);
    };

    const purchasedCourses = courses.filter(course =>
        paymentDetails.some(payment => payment.course === course.id)
    );

    console.log(courses, "fisanfasi")

    return (
        <>
            <Navbar />
            <Flex h="90vh" p={10}>
                <SidebarUser />
                <Box
                    flex="1"
                    bg="white"
                    p={10}
                    borderRadius="md"
                    boxShadow="xl"
                    overflowY="auto"
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            bg: 'gray.100',
                            borderRadius: '8px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            bg: 'teal.400',
                            borderRadius: '8px',
                        },
                    }}
                >
                    <Heading
                        mb={6}
                        color="teal.600"
                        textAlign="center"
                        fontSize="2xl"
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wider"
                    >
                        My Courses
                    </Heading>
                    {purchasedCourses.length > 0 ? (
                        <UnorderedList spacing={4}>
                            {purchasedCourses.map((course) => (
                                <ListItem
                                    key={course.id}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    p={6}
                                    bg="white"
                                    onClick={() => navigateToChapters(course.id)}
                                    boxShadow="md"
                                    transition="all 0.2s ease-in-out"
                                    _hover={{
                                        boxShadow: 'lg',
                                        transform: 'translateY(-2px)',
                                    }}
                                >
                                    <Flex justify="space-between" align="center">
                                        <Box>
                                            <Heading
                                                as="h3"
                                                size="md"
                                                mb={2}
                                                color="teal.700"
                                                fontWeight="semibold"
                                            >
                                                {course.title}
                                            </Heading>
                                            <Text color="gray.600" fontSize="sm">
                                                Category: {categories.find(category => category.id === course.category)?.name}
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                Instructor: {instructors.find(instructor => instructor.id === course.instructor)?.name} | Duration: {course.duration}
                                            </Text>
                                            <Text color="gray.600" fontSize="sm">
                                                Language: {course.language} | Level: {course.level}
                                            </Text>
                                        </Box>
                                        {/* <Badge
                                        colorScheme={'green'}
                                        fontSize="lg"
                                        fontWeight="bold"
                                        borderRadius="full"
                                        px={4}
                                    >
                                        70 % Complete
                                    </Badge> */}
                                    </Flex>
                                    <Divider my={4} borderColor="gray.300" />
                                    <Text color="gray.500" fontSize="sm">
                                        {course.description}
                                    </Text>
                                </ListItem>
                            ))}
                        </UnorderedList>
                    ) : (
                        <Text color="gray.600" fontWeight="bold" textAlign="center" mt={10}>
                            No active courses.
                        </Text>
                    )}
                </Box>
            </Flex>
        </>
    );
}

export default CourseHistory;
