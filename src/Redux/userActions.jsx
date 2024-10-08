import axios from "axios";
import api from "../Services/api"

export const fetchUser = (userId) => async (dispatch) => {
    try {
        console.log("Fetching User");

        if (userId) {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_BASE_URL}users/userdetail/${userId}/`
            );

            dispatch({ type: "FETCH_USER_SUCCESS", payload: response.data });
        } else {
            console.log("No userId provided");
        }
    } catch (error) {
        console.log("Fetching user error", error);
        dispatch({ type: "FETCH_USER_FAILURE", payload: error.message || "Unknown error" });
    }
};


export const setSelectedChatUser = (user) => {
    return {
        type: "SET_SELECTED_CHAT_USER",
        payload: user,
    };
};


export const logoutUser = () => {
    return (dispatch) => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        
        dispatch({ type: 'LOGOUT_USER' });
    };
};
