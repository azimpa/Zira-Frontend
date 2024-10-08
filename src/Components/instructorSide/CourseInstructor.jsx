import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
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
    Textarea,
    Select,
    FormLabel,
    Image,
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
import { useNavigate } from "react-router-dom";
import { fetchCategories, fetchInstructorCourses, fetchInstructorList } from "../../Services/apiUtils";

export default function CourseInstructor() {
    const navigate = useNavigate();
    const instructorDetails = useSelector(state => state.user);
    const insId = instructorDetails.user.id


    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [courseEdit, setCourseEdit] = useState(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState();
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState("");
    const [language, setLanguage] = useState("");
    const [price, setPrice] = useState();
    const [level, setLevel] = useState("");
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formError, setFormError] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = () => resetState();

    const onOpen = () => {
        setIsOpen(true);
        setIsEditMode(false);
        setCourseEdit(null);
    };

    const resetState = () => {
        setIsOpen(false);
        setIsEditMode(false);
        setCourseEdit(null);
        setTitle("");
        setCategory();
        setDescription("");
        setLanguage("");
        setDuration("");
        setPrice();
        setLevel("");
        setImage(null);
        setPreviewImage(null);
        setFormError([]);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesData, categoriesData, instructorsData] = await Promise.all([
                    fetchInstructorCourses(insId),
                    fetchCategories(),
                    fetchInstructorList()
                ]);

                setCourses(coursesData);
                setCategories(categoriesData);
                setInstructors(instructorsData);
            } catch (error) {
                console.error("Error fetching Data", error);
            }
        };
        fetchData();
    }, [courses]);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError([]);
        setIsSubmitting(true);

        const isNewImageUploaded = image !== null && image !== courseEdit?.image;
        const isImageRemoved = image === null || previewImage === null;

        const requiredFields = isEditMode
            ? [title, category, description, duration, language, level, price]
            : [title, category, description, duration, image, language, level, price]

        if (requiredFields.some((field) => !field)) {
            setFormError(["Please fill in all required fields"]);
            setTimeout(() => setFormError([]), 5000);
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("instructor", insId);
        formData.append("description", description);
        formData.append("duration", duration);
        formData.append("language", language);
        formData.append("level", level);
        formData.append("price", price);

        if (isNewImageUploaded) {
            formData.append("image", image);
        } else if (isImageRemoved) {
            formData.append("image", '');
        }

        formData.append("is_active", true);

        const url = isEditMode
            ? `${import.meta.env.VITE_APP_BASE_URL}instructor/course/${courseEdit.id}/`
            : `${import.meta.env.VITE_APP_BASE_URL}instructor/course`;

        try {
            const method = isEditMode ? 'patch' : 'post';
            const response = await api.request({
                method,
                url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" }
            });
            const successMessage = isEditMode ? "Course updated successfully" : "New Course added successfully";
            const updatedCourses = await fetchInstructorCourses(insId);
            setCourses(updatedCourses);
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
                setFormError(['error occurred must check properly']);
                console.error(error.response);
            } else {
                setFormError(['An error occurred. Please try again.']);
                console.error(error.response);
            }
        } finally {
            setIsSubmitting(false); // Reset loading state
        }
    };

    const handleEdit = (courseId) => {
        setIsOpen(true);
        setIsEditMode(true);
        const editCourse = courses.find((course) => course.id === courseId);
        setCourseEdit(editCourse);
        setTitle(editCourse.title);
        setCategory(editCourse.category);
        setDescription(editCourse.description);
        setLanguage(editCourse.language);
        setDuration(editCourse.duration);
        setPrice(editCourse.price);
        setLevel(editCourse.level);
        setImage(editCourse.image);
        setPreviewImage(editCourse.image);
    };

    const handleToggleCourse = async (courseId) => {
        try {
            await api.put(`${import.meta.env.VITE_APP_BASE_URL}instructor/course/${courseId}/`);
            const updatedCourses = await fetchInstructorCourses(insId);
            setCourses(updatedCourses.map(course => course.id === courseId ? { ...course, is_Active: !course.is_Active } : course));
        } catch (error) {
            console.error('Error toggling courses status', error);
        }
    };


    const navigateToChapters = (courseId) => {
        navigate(`/chapterinstructor?courseId=${courseId}`);
    };



    return (
        <>
            <Box as="section" minH="100vh">
                {/* SideBarIns */}
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
                        <Text
                            textAlign="center"
                            fontSize="3xl"
                            color="teal.500"
                            fontWeight="bold"
                            mb={6}
                        >
                            COURSE MANAGEMENT
                        </Text>
                        <Box borderRadius="md">
                            <Table variant="simple" size="sm" colorScheme="teal">
                                <Thead>
                                    <Tr>
                                        {/* <Th textAlign="center">Duration</Th> */}
                                        {/* <Th textAlign="center">Price</Th> */}
                                        {/* <Th textAlign="center">Language</Th> */}
                                        {/* <Th textAlign="center">Level</Th> */}
                                        <Th textAlign="center">ID</Th>
                                        <Th textAlign="center">Image</Th>
                                        <Th textAlign="center">Title</Th>
                                        <Th textAlign="center">Category</Th>
                                        <Th textAlign="center">Instructor</Th>
                                        {/* <Th textAlign="center">More Details</Th> */}
                                        <Th textAlign="center">Chapters</Th>
                                        <Th textAlign="center">Approved</Th>
                                        <Th textAlign="center">Status</Th>
                                        <Th textAlign="center">Actions</Th>
                                        <Th>
                                            <Button
                                                size="xs"
                                                bgColor="teal"
                                                color="white"
                                                _hover={{ bgColor: "teal.800" }}
                                                onClick={onOpen}
                                            >
                                                ADD NEW
                                            </Button>
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {courses
                                        .sort((a, b) => a.id - b.id)
                                        .map((course, index) => (
                                            <Tr key={index}>
                                                {/* <Td textAlign="center">{course.duration}</Td> */}
                                                {/* <Td textAlign="center">{course.price}</Td> */}
                                                {/* <Td textAlign="center">{course.level}</Td> */}
                                                {/* <Td textAlign="center">{course.language}</Td> */}
                                                <Td textAlign="center">{course.id}</Td>
                                                <Td textAlign="center">
                                                    <Image src={course.image} alt={course.title} boxSize="50px" objectFit="cover" />
                                                </Td>
                                                <Td textAlign="center">{course.title}</Td>
                                                <Td textAlign="center">
                                                    {categories.find((category) => category.id === course.category)?.name}
                                                    {/* {course.category.name} */}
                                                </Td>
                                                <Td textAlign="center">
                                                    {instructors.find((instructor) => instructor.id === course.instructor)?.name}
                                                    {/* {course.instructor.name} */}
                                                </Td>
                                                {/* <Td textAlign="center">
                                                    <Button
                                                        size="xs"
                                                        bgColor="peru"
                                                        color="white"
                                                        _hover={{ bgColor: "pink.700" }}
                                                    onClick={() => navigateToChapters(course.id)}
                                                    >
                                                        VIEW
                                                    </Button>
                                                </Td> */}
                                                {course.status === 'Pending' || course.status === 'Approved' ? (
                                                    <>
                                                        <Td textAlign="center">
                                                            <Button
                                                                size="xs"
                                                                bgColor="blue"
                                                                color="white"
                                                                _hover={{ bgColor: "blue.700" }}
                                                                onClick={() => navigateToChapters(course.id)}
                                                            >
                                                                CHAPTERS
                                                            </Button>
                                                        </Td>
                                                    </>
                                                ) : (
                                                    <Td textAlign="center">NIL</Td>
                                                )}
                                                <Td textAlign="center">{course.status}</Td>
                                                {course.status === 'Pending' || course.status === 'Approved' ? (
                                                    <>
                                                        <Td textAlign="center">
                                                            <Button
                                                                size="xs"
                                                                colorScheme={course.is_active ? "red" : "green"}
                                                                onClick={() => handleToggleCourse(course.id)}
                                                            >
                                                                {course.is_active ? "DISABLE" : "ENABLE"}
                                                            </Button>
                                                        </Td>
                                                        <Td textAlign="center">
                                                            <Button
                                                                size="xs"
                                                                colorScheme="blue"
                                                                onClick={() => handleEdit(course.id)}
                                                            >
                                                                EDIT
                                                            </Button>
                                                        </Td>
                                                    </>
                                                ) : (
                                                    <Td textAlign="center">Rejected</Td>
                                                )}
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
                            {isEditMode ? "EDIT COURSE" : "ADD NEW COURSE"}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {formError.length > 0 && (
                                <Box mt={4} ml={5} color="red.500">
                                    <ul>
                                        {formError.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </Box>
                            )}
                            <FormControl>
                                <Flex direction="column" align="center">
                                    <Flex mb={5} w="100%" justify="space-between">
                                        <Input
                                            type="name"
                                            fontWeight="bold"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter Course Title"
                                            width="45%"
                                        />
                                        <Select
                                            placeholder="Select Category"
                                            fontWeight="bold"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            width="45%"
                                        >
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                    <Flex mb={5} w="100%" justify="space-between">
                                        <Textarea
                                            type="text"
                                            fontWeight="bold"
                                            size="md"
                                            resize="vertical"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Enter Course Description"
                                            width="45%"
                                            height="150px"
                                        />
                                        <Input
                                            type="text"
                                            fontWeight="bold"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                            placeholder="Enter Course Duration"
                                            width="45%"
                                        />
                                    </Flex>
                                    <Flex mb={5} w="100%" justify="space-between">
                                        <Select
                                            w="45%"
                                            fontWeight="bold"
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            placeholder="Select Course Language"
                                        >
                                            <option value="english">English</option>
                                            <option value="malayalam">Malayalam</option>
                                            <option value="tamil">Tamil</option>
                                        </Select>
                                        <Input
                                            fontWeight="bold"
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Enter Course Price"
                                            width="45%"
                                        />
                                    </Flex>
                                    <Flex mb={5} w="100%" justify="space-between">
                                        <Select
                                            width="45%"
                                            fontWeight="bold"
                                            value={level}
                                            onChange={(e) => setLevel(e.target.value)}
                                            placeholder="Select Course Level"
                                        >
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                        </Select>
                                    </Flex>
                                    <Flex w="100%" align="center" justify="center" mb={5}>
                                        {previewImage ? (
                                            <Flex dir="row">
                                                <Box align="center">
                                                    <Text fontWeight="bold" mb={2}>
                                                        Preview Image:
                                                    </Text>
                                                    <Image src={previewImage} boxSize="100px" objectFit="cover" />
                                                    <Button colorScheme="blue" mt={2} size="sm" onClick={() => setPreviewImage(null)}>
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </Flex>
                                        ) : (
                                            <FormControl width="45%">
                                                <FormLabel fontWeight="bold" htmlFor="image">
                                                    Add Image:
                                                </FormLabel>
                                                <Input
                                                    mt="2"
                                                    type="file"
                                                    id="image"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                            </FormControl>
                                        )}
                                    </Flex>
                                </Flex>
                            </FormControl>
                            <Center>
                                <Button bgColor="purple" color="white" mt={5} onClick={handleSubmit} disabled={isSubmitting}>
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