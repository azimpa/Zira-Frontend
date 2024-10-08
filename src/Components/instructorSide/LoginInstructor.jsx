import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../Redux/userActions';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  Box,
  Heading,
  Text,
  Input,
  Stack,
  FormControl,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  Link,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const LoginInstructor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}users/login`,
        { email, password }
      );

      const { user, access, refresh } = response.data;

      if (user.is_approved && user.is_instructor) {
        const userid = user.id;
        dispatch(fetchUser(userid)).then(() => {
          localStorage.setItem('access', access);
          localStorage.setItem('refresh', refresh);
          navigate('/instructordashboard');
        });
      } else {
        toast({
          title: 'User is not Approved or not an Instructor',
          description: 'Please check or contact the administrator',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={20} p={8} borderWidth={1} borderRadius={8} boxShadow="lg" bg="transparent">
      <Heading fontSize="3xl" fontWeight="bold" color="teal.500" textAlign="center" mb={4}>
        Log In
      </Heading>
      <Text fontSize="md" color="gray.600" textAlign="center" mb={6}>
        Welcome back! Log in to your account.
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="filled"
              placeholder="Email Address"
              borderRadius="full"
            />
          </FormControl>

          <FormControl>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="filled"
                placeholder="Password"
                borderRadius="full"
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  colorScheme="teal"
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                  onClick={handleTogglePassword}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            size="md"
            width="100%"
            isLoading={loading}
            borderRadius="full"
          >
            {loading ? 'Logging In...' : 'Login'}
          </Button>

          <Text textAlign="center" mt={2} fontSize="sm" fontFamily="cursive" color="teal.500">
            Don't have an account?{' '}
            <Link href="/registerinstructor" color="teal.500">
              Sign Up
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginInstructor;
