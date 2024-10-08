import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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

const SignupUser = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTogglePassword = () => setShowPassword(!showPassword);
  const handleToggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = {
      name: fullName,
      email,
      password,
      contact_number: contactNumber,
      is_active: true,
    };

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}users/register`,
        formData
      );

      toast({
        title: 'Account created.',
        description: 'Your account has been successfully created.',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });

      navigate('/login');
    } catch (error) {
      console.error('Registration Failed:', error);

      const errorMessage = error.response?.data?.error || 'An unexpected error occurred. Please try again.';
      toast({
        title: 'Registration failed',
        description: errorMessage,
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
        Sign Up
      </Heading>
      <Text fontSize="md" color="gray.600" textAlign="center" mb={6}>
        Create a new account to get started
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              variant="filled"
              placeholder="Full Name"
              borderRadius="full"
            />
          </FormControl>

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
            <Input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              variant="filled"
              placeholder="Contact Number"
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

          <FormControl>
            <InputGroup>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                variant="filled"
                placeholder="Confirm Password"
                borderRadius="full"
              />
              <InputRightElement>
                <IconButton
                  variant="ghost"
                  colorScheme="teal"
                  icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  onClick={handleToggleConfirmPassword}
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Text textAlign="center" mt={2} fontSize="sm" fontFamily="cursive" color="teal.500">
            Already have an account?{' '}
            <Link onClick={() => navigate('/login')} color="teal.500">
              Login
            </Link>
          </Text>
        </Stack>
      </form>
    </Box>
  );
};

export default SignupUser;
