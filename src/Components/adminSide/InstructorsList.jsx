import React, { useState, useEffect } from 'react';
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

export default function InstructorsList() {
  const [instructors, setInstructors] = useState([]);

  const fetchInstructors = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}adminzira/instructorlist`
      );
      setInstructors(response.data);
    } catch (error) {
      console.error('Error fetching instructors', error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, [instructors]);

  const handleToggleInstructor = async (instructorId) => {
    try {
      const response = await api.patch(
        `${import.meta.env.VITE_APP_BASE_URL}adminzira/instructorstatus/${instructorId}/`
      );
      setInstructors((prevInstructors) =>
        prevInstructors.map((instructor) =>
          instructor.id === instructorId
            ? { ...instructor, is_Approved: !instructor.is_Approved }
            : instructor
        )
      );
      await fetchInstructors();
    } catch (error) {
      console.error('Error toggling instructor status:', error);
    }
  };

  const sortedInstructors = [...instructors].sort((a, b) => a.id - b.id);

  return (
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
              INSTRUCTOR MANAGEMENT
            </Text>

            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th textAlign="center">ID</Th>
                  <Th textAlign="center">Name</Th>
                  <Th textAlign="center">Email</Th>
                  <Th textAlign="center">Phone Number</Th>
                  <Th textAlign="center">Status</Th>
                  <Th textAlign="center">Actions</Th>
                </Tr>
              </Thead>

              <Tbody>
                {sortedInstructors.map((instructor) => (
                  <Tr key={instructor.id}>
                    <Td textAlign="center">{instructor.id}</Td>
                    <Td textAlign="center">{instructor.name}</Td>
                    <Td textAlign="center">{instructor.email}</Td>
                    <Td textAlign="center">{instructor.contact_number}</Td>
                    <Td textAlign="center">{instructor.is_approved ? 'Approved' : 'Unapproved'}</Td>
                    <Td textAlign="center">
                      <Button
                        size="sm"
                        colorScheme={instructor.is_approved ? 'red' : 'green'}
                        onClick={() => handleToggleInstructor(instructor.id)}
                      >
                        {instructor.is_approved ? 'Reject' : 'Approve'}
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
}
