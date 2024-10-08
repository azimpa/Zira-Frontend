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

export default function UsersList() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_APP_BASE_URL}adminzira/userlist`
      );
      setUsers(response.data);
      console.log(response.data, "users")
    } catch (error) {
      console.error('Error fetching user', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [users]);

  const handleToggleUser = async (userId) => {
    try {
      const response = await api.patch(
        `${import.meta.env.VITE_APP_BASE_URL}adminzira/userstatus/${userId}/`
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_Active: !user.is_Active } : user
        )
      );
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const sortedUsers = [...users].sort((a, b) => a.id - b.id);

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
              USER MANAGEMENT
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
                {sortedUsers.map((user) => (
                  <Tr key={user.id}>
                    <Td textAlign="center">{user.id}</Td>
                    <Td textAlign="center">{user.name}</Td>
                    <Td textAlign="center">{user.email}</Td>
                    <Td textAlign="center">{user.contact_number}</Td>
                    <Td textAlign="center">{user.is_active ? 'Active' : 'Blocked'}</Td>
                    <Td textAlign="center">
                      <Button
                        size="sm"
                        colorScheme={user.is_active ? 'red' : 'green'}
                        onClick={() => handleToggleUser(user.id)}
                      >
                        {user.is_active ? 'Block' : 'Unblock'}
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
