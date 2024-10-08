import React, { useEffect, useState } from 'react';
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';
import api from '../../Services/api';
import SideBar from './SideBar';
import Swal from 'sweetalert2';

export default function CategoryAdmin() {
    const [category, setCategory] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoryEdit, setCategoryEdit] = useState(null);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [formError, setFormError] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => {
        resetState();
    }

    const resetState = () => {
        setIsOpen(false);
        setIsEditMode(false);
        setCategoryEdit(null);
        setName("");
        setImage(null);
        setFormError([]);
    }

    const onOpen = () => {
        setIsOpen(true);
        setIsEditMode(false);
        setCategoryEdit(null);
    };

    const fetchCategory = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}adminzira/category`);
            setCategory(response.data);
            console.table("Category details", response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [category]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError([]);

        if (!name || !image) {
            setFormError(["Please fill all the required fields"]);
            setTimeout(() => setFormError([]), 5000);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);
        formData.append("is_active", true);
        console.log('First Form Data:', formData);

        const url = isEditMode
            ? `${import.meta.env.VITE_APP_BASE_URL}adminzira/category/${categoryEdit.id}/`
            : `${import.meta.env.VITE_APP_BASE_URL}adminzira/category`;

        try {
            const response = await api.request({
                method: isEditMode ? 'patch' : 'post',
                url,
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            const successMessage = isEditMode ? "Category updated successfully" : "New Category added successfully";
            resetState();
            fetchCategory();

            Swal.fire({
                icon: "success",
                title: successMessage,
                showConfirmButton: false,
                timer: 1000,
            });

        } catch (error) {
            console.error(error);

            if (error.response && error.response.status === 400) {
                setFormError(["error ocuures must check porperly"]);
            } else {
                setFormError(["An error occurred. Please try again."]);
            }
        }
    };

    const handleEdit = (categoryId) => {
        setIsOpen(true);
        setIsEditMode(true);
        const editedCategory = category.find((category) => category.id === categoryId);
        setCategoryEdit(editedCategory);
        setName(editedCategory.name);
        setImage(editedCategory.image)
        console.log("Category Edit mode", editedCategory);
    };


    const handleToggleCategory = async (categoryId) => {
        try {
            await api.patch(`${import.meta.env.VITE_APP_BASE_URL}adminzira/categorystatus/${categoryId}/`)

            setCategory((prevCategory) =>
                prevCategory.map((category) =>
                    category.id === categoryId ? { ...category, is_Active: !category.is_Active } : category
                )
            )
            await fetchCategory();
        } catch (error) {
            console.error("Error toggling category status", error)
        }
    }

    return (
        <>
            <Box as="section" minH="100vh">
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
                                CATEGORY MANAGEMENT
                            </Text>

                            <Table variant="simple" size="md">
                                <Thead>
                                    <Tr>
                                        <Th textAlign="center">ID</Th>
                                        <Th textAlign="center">Image</Th>
                                        <Th textAlign="center">Category Name</Th>
                                        <Th textAlign="center">Status</Th>
                                        <Th textAlign="center">Actions</Th>
                                        <Th>
                                            <Button colorScheme="blue" onClick={onOpen} size="sm">Add New</Button>
                                        </Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {category.map((category) => (
                                        <Tr key={category.id}>
                                            <Td textAlign="center">{category.id}</Td>
                                            <Td><img src={category.image} style={{ maxWidth: "50px" }} /></Td>
                                            <Td textAlign="center" fontWeight="bold">{category.name}</Td>
                                            <Td textAlign="center">{category.is_active ? 'Active' : 'Blocked'}</Td>
                                            <Td textAlign="center">
                                                <Button
                                                    size="sm"
                                                    colorScheme={category.is_active ? 'red' : 'green'}
                                                    onClick={() => handleToggleCategory(category.id)}
                                                >
                                                    {category.is_active ? 'Block' : 'Unblock'}
                                                </Button>
                                                <Button size="sm" ml={2} bgColor="teal" color="white" _hover={{ bgColor: 'teal.300' }} onClick={() => handleEdit(category.id)}>
                                                    Edit
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                            <Modal isOpen={isOpen} onClose={onClose}>
                                <ModalOverlay />
                                <ModalContent borderRadius="lg">
                                    {formError.length > 0 && (
                                        <Box mt={4} ml={5} color="red.500">
                                            <ul>
                                                {formError.map((error, index) => (
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        </Box>
                                    )}
                                    <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center" color="teal.600">Category</ModalHeader>
                                    <ModalCloseButton color="teal.600" />
                                    <ModalBody pb={6}>
                                        <FormControl>
                                            <FormLabel fontSize="lg" color="teal.600">Category Name</FormLabel>
                                            <Input type='name' placeholder='Category name' id="image" value={name} onChange={(e) => setName(e.target.value)} />
                                        </FormControl>

                                        <FormControl mt={4}>
                                            <FormLabel fontSize="lg" color="teal.600" textAlign="center">Image</FormLabel>
                                            {isEditMode && categoryEdit && categoryEdit.image ? (
                                                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                                    <Text fontSize="md" color="gray.600" mb={4} fontWeight="bold">Current Image</Text>
                                                    <img src={categoryEdit.image} style={{ maxWidth: "100px", marginBottom: "30px" }} />
                                                </Box>
                                            ) : null}
                                            <Input placeholder='Image' type='file' onChange={(e) => setImage(e.target.files[0])} />
                                        </FormControl>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={handleSubmit} bg="teal.500">
                                            Submit
                                        </Button>
                                        <Button onClick={onClose} variant="outline" borderColor="teal.500" color="teal.500">Cancel</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </>
    );
}
