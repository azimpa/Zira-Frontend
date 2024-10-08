import api from "./api";

export const fetchCategories = async () => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}adminzira/category`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchCourses = async () => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}instructor/course`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchUserCourses = async () => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}instructor/user-courses`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchInstructorCourses = async (insId) => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}instructor/instructor-course/${insId}/`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchChapters = async () => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}instructor/chapter`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchUserList = async () => {
    try {
        const response = await api.get(
            `${import.meta.env.VITE_APP_BASE_URL}users/userlist`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchInstructorList = async () => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}adminzira/instructorlist`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchPaymentDetails = async (userId) => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}payment/payment-details/${userId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const orderHistory = async () => {
    try {
        const response = await api.get(`${import.meta.env.VITE_APP_BASE_URL}payment/orders-history`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};


export const fetchUserFromMessage = async (userId) => {
    try {
        const response = await api.get(
            `${import.meta.env.VITE_APP_BASE_URL}chat/userfrommessage/${userId}/`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
