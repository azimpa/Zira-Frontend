import React, { useState } from 'react';
import {
  Box, Flex, Link, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, Icon, useBreakpointValue, Drawer,
  DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, IconButton
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../Redux/userActions';
import { BsChat, BsList } from 'react-icons/bs';

const Navbar = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging Out...");
    localStorage.clear();
    dispatch(logoutUser());
    navigate("/");
  };

  if (user.is_superuser || user.is_instructor) {
    handleLogout();
  }

  // Use useBreakpointValue to determine when to hide certain menu items
  const displayMenuItems = useBreakpointValue({ base: 'none', md: 'flex' });
  const displayDrawerButton = useBreakpointValue({ base: 'flex', md: 'none' });

  return (
    <Box boxShadow="md" p={4} bg="transparent">
      <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap">
        <Link href="/" fontSize="3xl" fontWeight="bold" _hover={{ textDecoration: 'none', opacity: 0.8 }} fontFamily="Arial, sans-serif" letterSpacing="0.1em" lineHeight="1.5">
          ZIRA
        </Link>
        <Flex alignItems="center" fontWeight="bold" display={displayMenuItems}>
          <Link href="#" mr={4} _hover={{ textDecoration: 'none', color: 'teal.500' }} fontSize="lg">
            HOME
          </Link>
          <Link href="#" mr={4} _hover={{ textDecoration: 'none', color: 'teal.500' }} fontSize="lg">
            ABOUT
          </Link>
          <Link href="#" mr={4} _hover={{ textDecoration: 'none', color: 'teal.500' }} fontSize="lg">
            LEARN
          </Link>
          <Link href="#" _hover={{ textDecoration: 'none', color: 'teal.500' }} fontSize="lg">
            CATALOG
          </Link>
        </Flex>
        <Flex alignItems="center">
          {user && user.user && user.user.id ? (
            <>
              <Icon as={BsChat} mr={4} fontSize="xl" _hover={{ color: 'teal.500', cursor: 'pointer' }} onClick={() => navigate("/chatuser")} />
              <Menu>
                <MenuButton>
                  <Avatar size="sm" name='User' src={user.user.profile_pic ? user.user.profile_pic : "https://avatars2.githubusercontent.com/u/37842853?v=4"} />
                </MenuButton>
                <MenuList>
                  <MenuItem fontWeight="bold" textAlign="center" justifyContent="center">
                    {user.user.name}
                  </MenuItem>
                  <MenuItem justifyContent="center" onClick={() => navigate("/profile")}>Profile</MenuItem>
                  <MenuItem justifyContent="center" onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                colorScheme="teal"
                mr={3}
                _hover={{ bg: 'teal.500', color: 'white' }}
                transition="background-color 0.3s, color 0.3s"
                borderRadius="full"
                onClick={() => navigate("/login")}
              >
                LOGIN
              </Button>
              <Button
                colorScheme="teal"
                _hover={{ bg: 'teal.500', color: 'white' }}
                transition="background-color 0.3s, color 0.3s"
                borderRadius="full"
                onClick={() => navigate("/register")}
              >
                REGISTER
              </Button>
            </>
          )}
        </Flex>
        <IconButton
          aria-label="Open Menu"
          icon={<BsList />}
          display={displayDrawerButton}
          onClick={() => setDrawerOpen(true)}
        />
      </Flex>
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={() => setDrawerOpen(false)}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <Flex direction="column" align="center">
                <Link href="#" mb={4} fontSize="lg" onClick={() => setDrawerOpen(false)}>
                  HOME
                </Link>
                <Link href="#" mb={4} fontSize="lg" onClick={() => setDrawerOpen(false)}>
                  ABOUT
                </Link>
                <Link href="#" mb={4} fontSize="lg" onClick={() => setDrawerOpen(false)}>
                  LEARN
                </Link>
                <Link href="#" mb={4} fontSize="lg" onClick={() => setDrawerOpen(false)}>
                  CATALOG
                </Link>
                {user && user.user && user.user.id && (
                  <>
                    <Button
                      variant="outline"
                      colorScheme="teal"
                      mb={4}
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      colorScheme="teal"
                      mb={4}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                )}
                {(!user || !user.user || !user.user.id) && (
                  <>
                    <Button
                      variant="outline"
                      colorScheme="teal"
                      mb={4}
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate("/login");
                      }}
                    >
                      LOGIN
                    </Button>
                    <Button
                      colorScheme="teal"
                      mb={4}
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate("/register");
                      }}
                    >
                      REGISTER
                    </Button>
                  </>
                )}
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default Navbar;
