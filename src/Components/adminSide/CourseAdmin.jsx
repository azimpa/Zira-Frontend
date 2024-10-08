import React, { useEffect, useState } from 'react';
import {
    Text,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Flex,
    Td,
    Button,
    Stack,
} from '@chakra-ui/react';
import SideBar from './SideBar';
import api from '../../Services/api';
import { fetchCourses, fetchCategories } from '../../Services/apiUtils';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function CourseAdmin() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesData, categoriesData] = await Promise.all([fetchCourses(), fetchCategories()]);

                setCourses(coursesData);
                setCategories(categoriesData);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        fetchData();
    }, [courses]);

    const handleStatusChange = async (courseId, newStatus) => {
        const actionText = newStatus === 'Approved' ? 'Approve' : 'Reject';
        const confirmIcon = newStatus === 'Approved' ? 'success' : 'warning';
        const confirmButtonText = `Yes, ${actionText} the course`;

        Swal.fire({
            title: `Are you sure want to ${actionText} the Course ?`,
            icon: confirmIcon,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.patch(`${import.meta.env.VITE_APP_BASE_URL}adminzira/course/${courseId}/`, { status: newStatus });
                    const updatedCourses = await fetchCourses();
                    setCourses(updatedCourses);
                    Swal.fire({
                        icon: 'success',
                        title: `Course ${actionText.toLowerCase()}ed successfully`,
                        showConfirmButton: false,
                        timer: 1000,
                    });
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `An error occurred while ${actionText.toLowerCase()}ing the course. Please try again later.`,
                    });
                }
            }
        });
    };

    const handleToggleCourse = async (courseId) => {
        try {
            await api.put(`${import.meta.env.VITE_APP_BASE_URL}adminzira/course/${courseId}/`);
            const updatedCourses = await fetchCourses();
            setCourses(updatedCourses.map(course => course.id === courseId ? { ...course, is_Active: !course.is_Active } : course));
        } catch (error) {
            console.error('Error toggling courses status', error);
        }
    };

    const navigateToChapters = (courseId) => {
        navigate(`/chapteradmin?courseId=${courseId}`);
    };

    return (
        <>
            <Box as="section" bg="transparent" minH="100vh">
                {/* SideBar */}
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
                    mb="6"
                >
                </Flex>

                <Box p={2} ml="48">
                    <Box
                        bg="white"
                        borderRadius="lg"
                        p={5}
                        boxShadow="lg"
                    >
                        <Stack spacing={6} align="center">
                            <Text
                                textAlign="center"
                                fontSize="3xl"
                                fontWeight="bold"
                                color="teal"
                            >
                                COURSE MANAGEMENT
                            </Text>

                            <Table variant="simple" size="sm">
                                <Thead>
                                    <Tr>
                                        <Th textAlign="center">ID</Th>
                                        <Th textAlign="center">Image</Th>
                                        <Th textAlign="center">Title</Th>
                                        <Th textAlign="center">Category</Th>
                                        <Th textAlign="center">Description</Th>
                                        <Th textAlign="center">Chapters</Th>
                                        <Th textAlign="center">Course Status</Th>
                                        <Th textAlign="center">Status</Th>
                                        <Th textAlign="center">Actions</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {courses.sort((a, b) => a.id - b.id)
                                        .map((course) => (
                                            <Tr key={course.id}>
                                                <Td textAlign="center">{course.id}</Td>
                                                <Td><img src={course.image} style={{ maxWidth: "50px" }} alt="course thumbnail" /></Td>
                                                <Td textAlign="center" fontWeight="bold">{course.title}</Td>
                                                <Td textAlign="center">{categories.find(cat => cat.id === course.category)?.name}</Td>
                                                <Td textAlign="center">{course.description}</Td>
                                                <Td textAlign="center">
                                                    <Button
                                                        size="xs"
                                                        bgColor="peru"
                                                        color="white"
                                                        _hover={{ bgColor: "pink.700" }}
                                                        onClick={() => navigateToChapters(course.id)}
                                                    >
                                                        VIEW
                                                    </Button>
                                                </Td>
                                                <Td textAlign="center">{course.status}</Td>
                                                <Td textAlign="center">{course.status === 'Approved' ? (course.is_active ? 'Active' : 'Blocked') : 'Invalid'}</Td>
                                                <Td>
                                                    <Flex direction="row">
                                                        {course.status === 'Pending' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    colorScheme="green"
                                                                    onClick={() => handleStatusChange(course.id, 'Approved')}>Approve</Button>

                                                                <Button
                                                                    size="sm"
                                                                    ml={2}
                                                                    colorScheme="red"
                                                                    onClick={() => handleStatusChange(course.id, 'Rejected')}>Reject</Button>
                                                            </>
                                                        )}
                                                        {course.status === 'Approved' && (
                                                            <Button
                                                                size="xs"
                                                                colorScheme={course.is_active ? 'red' : 'green'}
                                                                onClick={() => handleToggleCourse(course.id)}
                                                            >
                                                                {course.is_active ? 'BLOCK' : 'UNBLOCK'}
                                                            </Button>
                                                        )}
                                                    </Flex>
                                                </Td>
                                            </Tr>
                                        ))}
                                </Tbody>
                            </Table>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
