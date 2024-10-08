const initialState = {
    courses: [],
    loading: false,
    error: null,
};

const courseReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_COURSES_REQUEST":
            return { ...state, loading: true };

        case "FETCH_COURSES_SUCCESS":
            return { ...state, loading: false, courses: action.payload, error: null };

        case "FETCH_COURSES_FAILURE":
            return { ...state, loading: false, courses: [], error: action.payload };

        default:
            return state;
    }
};

export default courseReducer;