import { Box, Stack, Text, Table, Thead, Tr, Th, Tbody, Td, Button, Flex } from '@chakra-ui/react';
import SideBarIns from "./SideBarIns";
import { fetchInstructorCourses, fetchUserCourses, fetchUserList } from '../../Services/apiUtils';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import api from '../../Services/api';

const Students = () => {
  const instructor = useSelector(state => state.user);
  const insId = instructor.user.id

  const [userCourses, setUserCourses] = useState([])
  const [Courses, setCourses] = useState([])
  const [userDetails, setUserDetails] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userCoursesData, instructorCoursesData, userData] = await Promise.all([
          fetchUserCourses(),
          fetchInstructorCourses(insId),
          fetchUserList(),
        ]);

        const filteredUserCourses = userCoursesData.filter(usercourse =>
          instructorCoursesData.some(course => course.id === usercourse.course && course.instructor === insId)
        );

        setUserCourses(filteredUserCourses);
        setCourses(instructorCoursesData)
        setUserDetails(userData)

      } catch (error) {
        console.error("Error fetching Data", error);
      }
    };
    fetchData();
  }, [userCourses, Courses, userDetails]);


  const handleToggleEnrollment = async (studentId, courseId) => {
    console.log(studentId, courseId, "oooooo")
    try {
      const response = await api.put(`${import.meta.env.VITE_APP_BASE_URL}instructor/enrollment/${studentId}/${courseId}/`);
      const updatedEnrollment = response.data.data;

      setUserCourses(prevCourses =>
        prevCourses.map(course =>
          course.student === studentId && course.course === courseId
            ? { ...course, is_active: updatedEnrollment.is_active }
            : course
        )
      );
    } catch (error) {
      console.error('Error toggling enrollment status', error);
    }
  };


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
            >
              STUDENT MANAGEMENT
            </Text>

            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  {/* <Th textAlign="center">Enrollment Date</Th> */}
                  <Th textAlign="center">Student ID</Th>
                  <Th textAlign="center">Student Name</Th>
                  <Th textAlign="center">Email</Th>
                  <Th textAlign="center">Phone Number</Th>
                  <Th textAlign="center">Courses</Th>
                  <Th textAlign="center">Payment Status</Th>
                  <Th textAlign="center">Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {userCourses.map((userCourse, index) => (
                  <Tr key={index}>
                    {/* <Td textAlign="center">{userCourse.enrollment_date}</Td> */}
                    <Td textAlign="center">{userCourse.student}</Td>
                    <Td textAlign="center">{userDetails.find(user => user.id === userCourse.student)?.name}</Td>
                    <Td textAlign="center">{userDetails.find(user => user.id === userCourse.student)?.email}</Td>
                    <Td textAlign="center">{userDetails.find(user => user.id === userCourse.student)?.contact_number}</Td>
                    <Td textAlign="center">{Courses.find(course => course.id === userCourse.course)?.title}</Td>
                    <Td textAlign="center">Paid</Td>
                    <Td textAlign="center">
                      <Button
                        size="xs"
                        colorScheme={userCourse.is_active ? "red" : "green"}
                        onClick={() => handleToggleEnrollment(userCourse.student, userCourse.course)}
                      >
                        {userCourse.is_active ? "BLOCK" : "UNBLOCK"}
                      </Button>
                    </Td>
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

export default Students;
