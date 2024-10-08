import React from 'react';
import { Box, Flex, Link, Text, IconButton, Stack, useColorMode } from '@chakra-ui/react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const { colorMode } = useColorMode();
  const footerBg = { light: 'gray.900', dark: 'teal.900' };
  const linkHoverColor = { light: 'teal.600', dark: 'teal.400' };
  const iconHoverColor = { light: 'teal.500', dark: 'teal.300' };

  return (
    <Box as="footer" py={8} bg={footerBg[colorMode]} color="whiteAlpha.800">
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        justify="space-between"
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
      >
        <Stack
          spacing={{ base: 4, md: 0 }}
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'flex-start' }}
        >
          <Link
            href="#"
            _hover={{ textDecoration: 'none', color: linkHoverColor[colorMode] }}
            css={{
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: linkHoverColor[colorMode],
                transition: 'width 0.3s ease-in-out',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            Home
          </Link>
          <Link
            href="#"
            _hover={{ textDecoration: 'none', color: linkHoverColor[colorMode] }}
            css={{
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: linkHoverColor[colorMode],
                transition: 'width 0.3s ease-in-out',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            About
          </Link>
          <Link
            href="#"
            _hover={{ textDecoration: 'none', color: linkHoverColor[colorMode] }}
            css={{
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-2px',
                left: 0,
                width: '0%',
                height: '2px',
                backgroundColor: linkHoverColor[colorMode],
                transition: 'width 0.3s ease-in-out',
              },
              '&:hover::after': {
                width: '100%',
              },
            }}
          >
            Contact
          </Link>
        </Stack>
        <Stack spacing={4} direction="row" align="center" mt={{ base: 4, md: 0 }}>
          <IconButton
            as={Link}
            href="#"
            aria-label="Twitter"
            icon={<FaTwitter />}
            variant="ghost"
            _hover={{ color: iconHoverColor[colorMode] }}
            css={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          <IconButton
            as={Link}
            href="#"
            aria-label="LinkedIn"
            icon={<FaLinkedin />}
            variant="ghost"
            _hover={{ color: iconHoverColor[colorMode] }}
            css={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
          <IconButton
            as={Link}
            href="#"
            aria-label="GitHub"
            icon={<FaGithub />}
            variant="ghost"
            _hover={{ color: iconHoverColor[colorMode] }}
            css={{
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
        </Stack>
      </Flex>
      <Text
        textAlign="center"
        mt={4}
        fontSize="sm"
        fontWeight="semibold"
        color="whiteAlpha.600"
        css={{
          textShadow: `0 0 8px ${colorMode === 'light' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)'}`,
        }}
        px={{ base: 4, md: 0 }}
      >
        © 2024 Your Company. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
