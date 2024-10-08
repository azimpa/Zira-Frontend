import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Text, Heading, Button } from '@chakra-ui/react';
import { fetchChapters, fetchInstructorList, fetchPaymentDetails, fetchUserCourses } from '../../Services/apiUtils';
import Navbar from './NavBar'
import Footer from './Footer'
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import api from '../../Services/api';

export default function Chapters() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get("courseId");

    const { courses, loading, error } = useSelector(state => state.course);
    const user = useSelector(state => state.user);
    const userId = user.user.id;

    const [course, setCourse] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [userCourse, setUserCourse] = useState({});

    console.log(userCourse, "rooor")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [chapterData, instructorData, paymentData, userCoursesData] = await Promise.all([
                    fetchChapters(),
                    fetchInstructorList(),
                    fetchPaymentDetails(userId),
                    fetchUserCourses(),
                ]);

                const foundCourse = courses.find(course => course.id === parseInt(courseId));
                const userCourses = userCoursesData.find(ucd => ucd.course === foundCourse.id && ucd.student === userId);

                setChapters(chapterData);
                setInstructors(instructorData);
                setPaymentDetails(paymentData);
                setCourse(foundCourse);
                setUserCourse(userCourses);

            } catch (error) {
                console.error("Error fetching Data", error);
            }
        };

        fetchData();
    }, [courseId, userId, courses, userCourse, chapters]);

    const filteredChapters = chapters.filter(ch => ch.course === parseInt(courseId));
    const isCoursePurchased = paymentDetails.some(payment => payment.course === parseInt(courseId) && payment.payment_status === 'paid');

    const handlePayment = async (courseId) => {
        try {
            setPaymentLoading(true);
            const response = await api.post(
                `${import.meta.env.VITE_APP_BASE_URL}payment/create-checkout-session/${courseId}`
            );
            if (response.data && response.data.redirect_url) {
                window.location.href = response.data.redirect_url;
            } else {
                Swal.fire({
                    title: "Unable To Initiate Payment",
                    icon: "error",
                });
            }
        } catch (error) {
            console.log("reason error:", error)
            Swal.fire({
                title: "Unable To Purchase Now! Please Try Later",
                icon: "error",
            });
        } finally {
            setPaymentLoading(false);
        }
    };



    const navigateToChat = (instructorId) => {
        navigate(`/chatuser?instructorId=${instructorId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading courses</p>;

    return (
        <>
            <Navbar />
            <Box>
                <Box position='relative'>
                    <Image src={course.image} alt='Banner Image' w='100%' h='550px' mb={6} style={{ opacity: 0.2 }} />
                    <Box position='absolute' top='50%' left='50%' transform='translate(-50%, -50%)' textAlign='center' fontWeight="bold" color='black'>
                        <Heading fontSize='4xl' mb={4}>
                            Welcome to {course.title} Course
                        </Heading>
                        <Text fontSize='lg' mb={6}>
                            {course.description}
                        </Text>
                        <Text fontSize='lg' mb={6}>
                            This course is designed for {course.level} level learners and is taught in {course.language}. With approximately {course.duration} hours of content, you'll gain comprehensive knowledge and practical insights.
                        </Text>
                        <Text fontSize='md' mb={8}>
                            Enroll now for just ₹{course.price}. Limited time offer! Join us to explore in-depth topics and master new techniques.
                        </Text>
                        <Button size='md' colorScheme='green' onClick={() => handlePayment(course.id)} display={isCoursePurchased ? 'none' : 'inline-block'}>
                            ENROLL NOW
                        </Button>
                    </Box>
                </Box>
                <Flex align="center" direction="column" mt={10}>
                    <Text fontWeight="bold" color="teal" fontSize="xl">Related Chapters</Text>
                </Flex>
                <Box maxW="100%" align="center" p={10}>
                    {filteredChapters && filteredChapters.map((chapter) => {
                        const isActive = userCourse ? userCourse.is_active && userCourse.course === chapter.course : false;
                        return (
                            <Flex key={chapter.id} p={6} bg="gray.50" borderRadius="xl" boxShadow="lg" w="90%" mb={8} alignItems="center">
                                {userCourse ? (
                                    isActive ? (
                                        <>
                                            <Box flex="1" borderRadius="lg">
                                                <ReactPlayer
                                                    url={chapter.video}
                                                    controls
                                                    height="auto"
                                                />
                                            </Box>
                                            <Box flex="2" ml="8" mt="4">
                                                <Heading as="h2" size="lg" mb={4} color="teal.600" textTransform="uppercase" letterSpacing="wide">
                                                    {chapter.name}
                                                </Heading>
                                                <Text mb={4} fontSize="md" color="gray.600">
                                                    {chapter.content}
                                                </Text>
                                            </Box>
                                        </>
                                    ) : (
                                        <Box border="2px" borderColor="red.500" p={6} borderRadius="lg" bg="red.50" w="full" textAlign="center">
                                            <Heading as="h3" size="md" color="red.700" fontWeight="bold" mb={4}>
                                                Access Restricted
                                            </Heading>
                                            <Text color="red.600" fontSize="md">
                                                You do not have permission to access this course. Please contact your instructor for assistance.
                                            </Text>
                                        </Box>
                                    )
                                ) : (
                                    <>
                                        <Box flex="1" borderRadius="lg">
                                            <ReactPlayer
                                                url={chapter.preview_video}
                                                controls
                                                height="auto"
                                            />
                                        </Box>
                                        <Box flex="2" ml="8" mt="4">
                                            <Heading as="h2" size="lg" mb={4} color="teal.600" textTransform="uppercase" letterSpacing="wide">
                                                {chapter.name}
                                            </Heading>
                                            <Text mb={4} fontSize="md" color="gray.600">
                                                {chapter.content}
                                            </Text>
                                        </Box>
                                    </>
                                )}
                            </Flex>
                        );
                    })}
                </Box>

                <Flex
                    direction='row'
                    justifyContent='center'
                    marginTop='5%'
                >
                    <Box
                        maxW='sm'
                        borderWidth='1px'
                        borderRadius='xl'
                        p={5}
                        overflow='hidden'
                        boxShadow='md'
                        bg='white'
                        w={{ base: '90%', sm: '45%', md: '30%', lg: '25%' }}
                        h='auto'
                        m={4}
                        transition='transform 0.2s'
                        _hover={{ transform: 'scale(1.05)' }}
                    >
                        <Flex align='center' justify='center' marginBottom={4}>
                            <Image maxW="200px" borderRadius="xl" />
                        </Flex>
                        <Heading fontSize='xl' fontWeight='semibold' color='gray.700' mb={2} textAlign='center'>
                            {instructors.find(instructor => instructor.id === course.instructor)?.name}
                        </Heading>
                        <Text fontSize='sm' color='gray.600' mb={4} textAlign='center'>
                            {instructors.find(instructor => instructor.id === course.instructor)?.name} is a full stack developer who was previously the lead instructor at a coding bootcamp. With a degree in International Communications, her passion is to express thoughts well, whether in code or writing.
                        </Text>
                        <Flex justify='center'>
                            <Button size='sm' colorScheme='blue' onClick={() => navigateToChat(instructors.find(instructor => instructor.id === course.instructor)?.id)}>Chat</Button>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
            <Footer />
        </>
    )
}