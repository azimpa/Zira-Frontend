import { Fragment } from "react";
import {
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  Box,
  Button,
} from "@chakra-ui/react";

const Hero = () => {
  return (
    <>
      <Container maxW="6xl" px={{ base: 6, md: 10 }} py={{ base: 10, md: 14 }}>
        <Stack
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          spacing={{ base: 8, md: 10 }}
        >
          <Stack direction="column" spacing={6} justifyContent="center">
            <chakra.h1
              fontSize={{ base: "3xl", md: "5xl" }}
              lineHeight={1.2}
              fontWeight="bold"
              textAlign={{ base: "center", md: "left" }}
            >
              Learn
              <chakra.span
                bgGradient="linear(to-br, #228be6, #15aabf)"
                bgClip="text"
              >
                {" "}
                New Skills{" "}
              </chakra.span>
              <br /> Prove Your Potential
            </chakra.h1>
            <Text
              color={useColorModeValue("gray.500", "gray.400")}
              fontSize={{ base: "md", md: "lg" }}
              textAlign={{ base: "center", md: "left" }}
              fontWeight="400"
              maxW={{ base: "100%", md: "700px" }}
            >
              Revolutionize your learning experience with our cutting-edge ZIRA.
              Access a diverse range of courses anytime, anywhere. Engage with
              expert instructors, interactive content, and collaborative tools.
              Elevate your skills, advance your career, and embrace a flexible,
              personalized learning journey. Join us on the path to knowledge
              and success.
            </Text>
            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={2}
              justify={{ base: "center", md: "flex-start" }}
            >
              <Button
                h={12}
                px={6}
                bgGradient="linear(to-br, #228be6, #15aabf)"
                color="white"
                _hover={{ bgGradient: "linear(to-br, #228be6, #228be6)" }}
                variant="solid"
                size="lg"
                rounded="md"
                fontWeight="bold"
              >
                Get started
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <Box overflow="hidden" mt={{ base: 6, md: 0 }}>
        <svg
          fill={useColorModeValue("#f7fafc", "#171923")}
          width="150%"
          height="56px"
          transform="scale(-1, 1)" // Correctly formatted scaleX(-1)
          filter="drop-shadow(10px 5px 5px rgba(0, 0, 0, 0.05))"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={`M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 
            250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 
            3V0H0v27.35a600.21 600.21 0 00321.39 29.09z`}
          ></path>
        </svg>
      </Box>
    </>
  );
};

export default Hero;
