import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../Redux/userActions';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  Box,
  Heading,
  Input,
  Stack,
  FormControl,
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

const LoginAdmin = () => {
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

      if (user.is_superuser) {
        const userId = user.id;
        dispatch(fetchUser(userId)).then(() => {
          localStorage.setItem('access', access);
          localStorage.setItem('refresh', refresh);
          navigate('/admindashboard');
        });
      } else {
        toast({
          title: 'Access Denied',
          description: 'Not a superuser. Please check your credentials.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid admin email or password. Please try again.',
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
        Admin Login
      </Heading>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
              borderRadius="full"
              variant="filled"
            />
          </FormControl>

          <FormControl>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                borderRadius="full"
                variant="filled"
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
        </Stack>
      </form>
    </Box>
  );
};

export default LoginAdmin;
