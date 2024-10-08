import React, { useState, useEffect } from 'react';
import { Box, Flex, Avatar, Input, Button, Icon, useToast, FormLabel } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import Navbar from './NavBar';
import SidebarUser from './SidebarUser';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchUser } from '../../Redux/userActions';

export default function Profile() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact_number: '',
        profile_pic: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.user.name,
                email: user.user.email,
                contact_number: user.user.contact_number,
                profile_pic: user.user.profile_pic,
            });
            setImagePreview(user.user.profile_pic);
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, profile_pic: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData({ ...formData, profile_pic: null });
            setImagePreview(null);
        }
    };

    const handleSubmit = async () => {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('contact_number', formData.contact_number);

        const isNewImageUploaded = formData.profile_pic !== null && formData.profile_pic !== user.user.profile_pic;
        const isImageRemoved = formData.profile_pic === null || imagePreview === null;

        if (isNewImageUploaded) {
            formDataToSend.append('profile_pic', formData.profile_pic);
        } else if (isImageRemoved) {
            formDataToSend.append('profile_pic', '');
        }

        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_APP_BASE_URL}users/profile-edit/${user.user.id}/`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast({
                title: response.data.message,
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: error.response?.data?.error || "Unknown error",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
        dispatch(fetchUser(user.user.id));
    };

    return (
        <>
            <Navbar />
            <Flex h="90vh" p={10}>
                <SidebarUser />
                {/* Main Content */}
                <Box flex="1" bg="white" p={10} borderRadius="md" boxShadow="xl">
                    <Flex align="center" mb={8} direction={{ base: 'column', md: 'row' }}>
                        <Flex align="center" direction="column" w="300px" h="300px" mt={{ base: 0, md: '60px' }} p={4}>
                            <Avatar
                                size="2xl"
                                src={imagePreview ? imagePreview : "https://avatars2.githubusercontent.com/u/37842853?v=4"}
                                mb={4}
                            />
                            {formData.profile_pic ? (
                                <Icon
                                    as={MdDelete}
                                    boxSize={6}
                                    color="red.500"
                                    cursor="pointer"
                                    onClick={() => {
                                        setFormData({ ...formData, profile_pic: null });
                                        setImagePreview(null);
                                    }}
                                />
                            ) : (
                                <Input
                                    name="profile_pic"
                                    type="file"
                                    mt={4}
                                    variant="flushed"
                                    accept="image/*"
                                    _placeholder={{ color: "gray.400" }}
                                    onChange={handleFileChange}
                                />
                            )}
                        </Flex>
                        <Box width="25vw" maxWidth="40vw" p={6}>
                            <FormLabel htmlFor="name" mb={2} color="gray.600">Name</FormLabel>
                            <Input
                                name="name"
                                placeholder="Enter your name"
                                mb={4}
                                variant="flushed"
                                _placeholder={{ color: "gray.400" }}
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                            <FormLabel htmlFor="email" mb={2} color="gray.600">Email</FormLabel>
                            <Input
                                name="email"
                                placeholder="Enter your email"
                                mb={4}
                                variant="flushed"
                                _placeholder={{ color: "gray.400" }}
                                value={formData.email}
                                isReadOnly={true}
                            />
                            <FormLabel htmlFor="contact_number" mb={2} color="gray.600">Contact Number</FormLabel>
                            <Input
                                name="contact_number"
                                placeholder="Enter your contact number"
                                mb={4}
                                variant="flushed"
                                _placeholder={{ color: "gray.400" }}
                                value={formData.contact_number}
                                onChange={handleInputChange}
                            />
                        </Box>
                    </Flex>
                    <Flex justify="flex-end">
                        <Button colorScheme="blue" _hover={{ bg: "blue.500" }} onClick={handleSubmit}>
                            Save
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </>
    );
}
