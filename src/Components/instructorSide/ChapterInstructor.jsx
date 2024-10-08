import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import api from '../../Services/api';
import {
  Box,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Image,
  FormLabel,
  Text,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormControl,
  ModalHeader,
  Spinner
} from "@chakra-ui/react";
import SideBarIns from "./SideBarIns";
import { useLocation } from "react-router-dom";
import { fetchChapters, fetchCourses } from "../../Services/apiUtils";

export default function ChapterInstructor() {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [chapterEdit, setChapterEdit] = useState(null);
  const [course, setCourse] = useState();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [formError, setFormError] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("courseId");

  const onClose = () => resetState();

  const onOpen = () => {
    setIsOpen(true);
    setIsEditMode(false);
    setChapterEdit(null);
  };

  const resetState = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setChapterEdit(null);
    setCourse();
    setName("");
    setContent("");
    setDuration("");
    setImage(null);
    setVideo(null);
    setPreviewVideo(null);
    setPreviewImage(null);
    setVideoUrl(null);
    setPreviewVideoUrl(null);
    setFormError([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chaptersData = await fetchChapters();
        const coursesData = await fetchCourses();
        setChapters(chaptersData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching Data", error);
      }
    };

    fetchData();
  }, [chapters]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setPreviewImage(null);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      const reader = new FileReader();
      reader.onload = () => {
        setVideoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVideo(null);
      setVideoUrl(null);
    }
  };

  const handlePreviewVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewVideo(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewVideoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewVideo(null);
      setPreviewVideoUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError([]);
    setIsSubmitting(true);

    const isNewImageUploaded = image !== null && image !== chapterEdit?.image;
    const isImageRemoved = image === null || previewImage === null;
    const isNewVideoUploaded = video !== null && video !== chapterEdit?.video;
    const isVideoRemoved = video === null || videoUrl === null;

    const requiredFields = isEditMode
      ? [name, content, duration]
      : [name, content, duration, image, video, previewVideo];

    if (requiredFields.some(field => !field)) {
      setFormError(["Please fill in all required fields"]);
      setTimeout(() => setFormError([]), 5000);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("course", courseId);
    formData.append("name", name);
    formData.append("content", content);
    formData.append("duration", duration);

    if (isNewImageUploaded) {
      formData.append("image", image);
    } else if (isImageRemoved) {
      formData.append("image", '');
    }

    if (isNewVideoUploaded) {
      formData.append("video", video);
    } else if (isVideoRemoved) {
      formData.append("video", '');
    }

    if (!isEditMode) {
      formData.append("preview_video", previewVideo);
    }

    formData.append("is_active", true);

    const url = isEditMode
      ? `${import.meta.env.VITE_APP_BASE_URL}instructor/chapter/${chapterEdit.id}/`
      : `${import.meta.env.VITE_APP_BASE_URL}instructor/chapter`;

    try {
      const method = isEditMode ? 'patch' : 'post';
      const response = await api.request({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" }
      });

      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`, "hff");
      }
      const successMessage = isEditMode ? "Chapter updated successfully" : "New Chapter added successfully";
      const updateChapters = await fetchChapters();
      setChapters(updateChapters);
      resetState();

      Swal.fire({
        icon: 'success',
        title: successMessage,
        showConfirmButton: false,
        timer: 1000,
      });

    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 400) {
        setFormError(['Error occurred. Please check the form fields.']);
        console.error(error.response);
      } else {
        setFormError(['An error occurred. Please try again.']);
        console.error(error.response);
      }
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleEdit = (chapterId) => {
    setIsOpen(true);
    setIsEditMode(true);
    const editChapter = chapters.find((chapter) => chapter.id === chapterId);
    setChapterEdit(editChapter);
    setCourse(editChapter.course);
    setName(editChapter.name);
    setContent(editChapter.content);
    setDuration(editChapter.duration);
    setImage(editChapter.image);
    setVideo(editChapter.video);
    setPreviewImage(editChapter.image);
    setVideoUrl(editChapter.video);
    setPreviewVideoUrl(editChapter.previewImage);
  };

  const handleToggleChapter = async (chapterId) => {
    try {
      await api.put(`${import.meta.env.VITE_APP_BASE_URL}instructor/chapter/${chapterId}/`);
      const updateChapters = await fetchChapters();
      setChapters(updateChapters.map(chapter => chapter.id === chapterId ? { ...chapter, is_active: !chapter.is_active } : chapter));
    } catch (error) {
      console.error('Error toggling chapter status', error);
    }
  };

  const filteredChapters = chapters.filter((ch) => ch.course === parseInt(courseId));

  return (
    <>
      <Box as="section" minH="100vh">
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
          <Box bg="white" borderRadius="lg" p={5} boxShadow="lg">
            <Text textAlign="center" fontSize="3xl" color="teal.500" fontWeight="bold" mb={6}>
              CHAPTER MANAGEMENT
            </Text>
            <Box borderRadius="md">
              <Table variant="simple" size="sm" colorScheme="teal">
                <Thead>
                  <Tr>
                    <Th textAlign="center">ID</Th>
                    <Th textAlign="center">Image</Th>
                    <Th textAlign="center">Course</Th>
                    <Th textAlign="center">Chapter Name</Th>
                    <Th textAlign="center">Content</Th>
                    <Th textAlign="center">Duration</Th>
                    <Th textAlign="center">Status</Th>
                    <Th textAlign="center">Actions</Th>
                    <Th>
                      <Button size="xs" bgColor="green" color="white" onClick={onOpen}>
                        ADD NEW
                      </Button>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredChapters.map((chapter) => (
                    <Tr key={chapter.id}>
                      <Td textAlign="center">{chapter.id}</Td>
                      <Td textAlign="center">
                        <Image src={chapter.image} alt={chapter.title} boxSize="50px" objectFit="cover" />
                      </Td>
                      <Td textAlign="center">{courses.find(course => course.id === chapter.course)?.title}</Td>
                      <Td textAlign="center">{chapter.name}</Td>
                      <Td textAlign="center">{chapter.content}</Td>
                      <Td textAlign="center">{chapter.duration}</Td>
                      <Td textAlign="center">
                        <Button
                          size="xs"
                          colorScheme={chapter.is_active ? "red" : "green"}
                          onClick={() => handleToggleChapter(chapter.id)}
                        >
                          {chapter.is_active ? "DISABLE" : "ENABLE"}
                        </Button>
                      </Td>
                      <Td textAlign="center">
                        <Button
                          size="xs"
                          colorScheme="blue"
                          onClick={() => handleEdit(chapter.id)}
                        >
                          EDIT
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent maxW="60vw" ml="10%" p={5} boxShadow="lg" borderRadius="md">
            <ModalHeader textAlign="center" fontWeight="bold" fontSize="2xl" color="purple.600">
              {isEditMode ? "EDIT CHAPTER" : "ADD NEW CHAPTER"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {formError.length > 0 && (
                <Box mt={4} color="red.500">
                  <ul>
                    {formError.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </Box>
              )}
              <FormControl>
                <Flex direction="column" gap={5}>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Chapter Name"
                    fontWeight="bold"
                    mb={5}
                  />
                  <Flex gap={5}>
                    <Input
                      type="text"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Enter Chapter Content"
                      fontWeight="bold"
                      flex="1"
                    />
                    <Input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="Enter Chapter Duration"
                      fontWeight="bold"
                      flex="1"
                    />
                  </Flex>
                  <Flex direction="column" gap={5}>
                    {previewImage ? (
                      <Box align="center">
                        <Text fontWeight="bold" mb={2}>
                          Preview Image:
                        </Text>
                        <Image src={previewImage} boxSize="100px" objectFit="cover" borderRadius="md" />
                        <Button colorScheme="blue" mt={2} size="sm" onClick={() => setPreviewImage(null)}>
                          Delete
                        </Button>
                      </Box>
                    ) : (
                      <FormControl width="45%">
                        <FormLabel fontWeight="bold" htmlFor="image">
                          Add Image:
                        </FormLabel>
                        <Input mt="2" type="file" id="image" accept="image/*" onChange={handleImageChange} />
                      </FormControl>
                    )}
                    {videoUrl ? (
                      <Box align="center">
                        <Text fontWeight="bold" mb={2}>
                          Current Video:
                        </Text>
                        <video src={videoUrl} width="200px" controls />
                        <Button colorScheme="blue" mt={2} size="sm" onClick={() => setVideoUrl(null)}>
                          Delete
                        </Button>
                      </Box>
                    ) : (
                      <FormControl width="45%">
                        <FormLabel fontWeight="bold" htmlFor="video">
                          Add Video:
                        </FormLabel>
                        <Input mt="2" type="file" id="video" accept="video/*" onChange={handleVideoChange} />
                      </FormControl>
                    )}
                    {!isEditMode && ( // Only show this block if not in edit mode
                      previewVideoUrl ? (
                        <Box align="center">
                          <Text fontWeight="bold" mb={2}>
                            Current Preview Video:
                          </Text>
                          <video src={previewVideoUrl} width="200px" controls />
                          <Button colorScheme="blue" mt={2} size="sm" onClick={() => setPreviewVideoUrl(null)}>
                            Delete
                          </Button>
                        </Box>
                      ) : (
                        <FormControl width="45%">
                          <FormLabel fontWeight="bold" htmlFor="previewVideo">
                            Add Preview Video:
                          </FormLabel>
                          <Input mt="2" type="file" id="previewVideo" accept="video/*" onChange={handlePreviewVideoChange} />
                        </FormControl>
                      )
                    )}
                  </Flex>
                </Flex>
              </FormControl>
              <Center>
                <Button bgColor="purple.500" color="white" mt={5} onClick={handleSubmit} _hover={{ bg: "purple.700" }} disabled={isSubmitting}>
                  {isSubmitting ? <Spinner size="sm" /> : 'Submit'}
                </Button>
              </Center>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
