import { combineReducers } from "redux";
import userReducer from "./userReducer";
import courseReducer from "./courseReducer";

const rootReducer = combineReducers({
    user: userReducer,
    course: courseReducer,
});

export default rootReducer;
