import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function SidebarUser() {
    return (
        <Flex
            direction="column"
            bgGradient="linear(to-b, teal.500, teal.700)"
            p={6}
            minW={{ base: '100%', sm: '250px' }} // Responsive width
            mr={{ base: 0, sm: 6 }} // Margin right adjustment
            borderRadius="lg"
            boxShadow="2xl"
            color="white"
        >
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" mb={10} textAlign="center">
                PROFILE
            </Text>
            <NavItem to="/profile">Personal Information</NavItem>
            <NavItem to="/coursehistory">Courses</NavItem>
        </Flex>
    );
}

// Custom NavItem component for styling links
const NavItem = ({ to, children }) => (
    <Text
        fontSize={{ base: 'md', md: 'lg' }} // Responsive font size
        mb={7}
        _hover={{
            color: "yellow.400",
            textDecoration: "none",
            transform: "scale(1.05)",
            transition: "all 0.3s ease-in-out"
        }}
    >
        <Link to={to}>{children}</Link>
    </Text>
);
