import React, { useEffect, useState } from 'react';
import { Box, SimpleGrid, Text, Flex, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { FiTrendingUp, FiUsers, FiDollarSign } from 'react-icons/fi';
import { Doughnut, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import SideBar from './SideBar';
import api from '../../Services/api';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        weeklySales: 0,
        totalstudentsCount: 0,
        totalSales: 0,
        coursePurchaseData: [],
        courseStatsData: [],
    });

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}adminzira/admin-dashboard`);
                setDashboardData({
                    weeklySales: response.data.weekly_sales,
                    totalstudentsCount: response.data.total_students_count,
                    totalSales: response.data.total_sales,
                    coursePurchaseData: response.data.course_purchase_data,
                    courseStatsData: response.data.course_stats_data,
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchDashboardStats();
    }, [dashboardData]);


    return (
        <Box as="section" minH="100vh">
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
            <Box p="3">
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing="6" ml="16%" p={2}>
                    <Stat
                        p={4}
                        boxShadow="lg"
                        borderRadius="md"
                        bgGradient="linear(to-r, teal.400, green.200)"
                        color="white"
                    >
                        <Flex justify="space-between">
                            <Box>
                                <StatLabel>Weekly Sales</StatLabel>
                                <StatNumber>₹{dashboardData.weeklySales}</StatNumber>
                                <StatHelpText>Increased By 60%</StatHelpText>
                            </Box>
                            <Box>
                                <FiTrendingUp size="24" />
                            </Box>
                        </Flex>
                    </Stat>

                    <Stat
                        p={4}
                        boxShadow="lg"
                        borderRadius="md"
                        bgGradient="linear(to-r, blue.400, purple.200)"
                        color="white"
                    >
                        <Flex justify="space-between">
                            <Box>
                                <StatLabel>Total Student Count</StatLabel>
                                <StatNumber>{dashboardData.totalstudentsCount}</StatNumber>
                                <StatHelpText>Increased By 10%</StatHelpText>
                            </Box>
                            <Box>
                                <FiUsers size="24" />
                            </Box>
                        </Flex>
                    </Stat>

                    <Stat
                        p={4}
                        boxShadow="lg"
                        borderRadius="md"
                        bgGradient="linear(to-r, red.400, orange.200)"
                        color="white"
                    >
                        <Flex justify="space-between">
                            <Box>
                                <StatLabel>Total Sales</StatLabel>
                                <StatNumber>₹{dashboardData.totalSales}</StatNumber>
                                <StatHelpText>Increased By 10%</StatHelpText>
                            </Box>
                            <Box>
                                <FiDollarSign size="24" />
                            </Box>
                        </Flex>
                    </Stat>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6" mt="6" ml="16%" p={2}>
                    <Box p={4} boxShadow="lg" mt="3" borderRadius="md" bg="white" width="100%" height="350px">
                        <Text fontSize="xl" mb="4">Course Purchase</Text>
                        <Bar
                            data={{
                                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                                datasets: [{
                                    label: 'Course Purchase',
                                    data: dashboardData.coursePurchaseData,
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                }]
                            }}
                        />
                    </Box>
                    <Box p={4} boxShadow="lg" mt="3" borderRadius="md" bg="white">
                        <Text fontSize="xl" mb="4">Course Stats</Text>
                        {dashboardData.courseStatsData && dashboardData.courseStatsData.length > 0 ? (
                            <Doughnut
                                data={{
                                    labels: dashboardData.courseStatsData.map(course => course.title),
                                    datasets: [{
                                        label: 'Course Stats',
                                        data: dashboardData.courseStatsData.map(course => course.student_count),
                                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                    }]
                                }}
                            />
                        ) : (
                            <Text>No data available</Text>
                        )}
                    </Box>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

export default AdminDashboard;

