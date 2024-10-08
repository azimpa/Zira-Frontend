import React, { useEffect, useState } from 'react';
import { Box, Stack, Text, Table, Thead, Tr, Th, Tbody, Td, Flex } from '@chakra-ui/react';
import SideBarIns from './SideBarIns';
import { useSelector } from 'react-redux';
import { fetchInstructorCourses, fetchUserList, orderHistory } from '../../Services/apiUtils';

const OrdersInstructor = () => {
    const instructor = useSelector(state => state.user);
    const insId = instructor.user.id

    const [orders, setOrders] = useState([])
    const [courses, setCourses] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersData, instructorCourseData, usersData] = await Promise.all([
                    orderHistory(),
                    fetchInstructorCourses(insId),
                    fetchUserList(),
                ]);

                const filteredOrders = ordersData.filter(order =>
                    instructorCourseData.some(course => course.id === order.course && course.instructor === insId)
                );
                setOrders(filteredOrders);
                setCourses(instructorCourseData)
                setUsers(usersData)
            } catch (error) {
                console.error("Error fetching Data", error);
            }
        };
        fetchData();
    }, [orders]);

    return (
        <Box as="section" minH="100vh">
            {/* SideBarIns */}
            <SideBarIns />
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
                    <Stack spacing={6} align="center">
                        <Text
                            textAlign="center"
                            fontSize="3xl"
                            fontWeight="bold"
                            color="teal"
                            mb={6}
                        >
                            Order History
                        </Text>

                        <Table variant="simple" size="md">
                            <Thead>
                                <Tr>
                                    <Th textAlign="center">Id</Th>
                                    <Th textAlign="center">Student Name</Th>
                                    <Th textAlign="center">Course</Th>
                                    <Th textAlign="center">Payment Mode</Th>
                                    <Th textAlign="center">Payment Status</Th>
                                    <Th textAlign="center">Amount</Th>
                                    <Th textAlign="center">Date</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {orders.map((order, index) => (
                                    <Tr key={index}>
                                        <Td textAlign="center">{order.id}</Td>
                                        <Td textAlign="center">{users.find(user => user.id === order.user)?.name}</Td>
                                        <Td textAlign="center">{courses.find(course => course.id === order.course)?.title}</Td>
                                        <Td textAlign="center">Card</Td>
                                        <Td textAlign="center">{order.payment_status}</Td>
                                        <Td textAlign="center">₹{order.price}</Td>
                                        <Td textAlign="center">{order.date}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default OrdersInstructor;
