import axios from "axios";

export const fetchCourseState = () => async (dispatch) => {
    try {
        dispatch({ type: "FETCH_COURSES_REQUEST" });
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}instructor/course`);

        const approvedCourses = response.data.filter(course => course.status === 'Approved' && course.is_active === true);

        dispatch({ type: "FETCH_COURSES_SUCCESS", payload: approvedCourses });
    } catch (error) {
        console.log("Fetching Courses Error", error);
        dispatch({ type: "FETCH_COURSES_FAILURE", payload: error.message || "unknown error" });
    }
};