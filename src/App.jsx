import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from './Redux/store';
import { Provider } from 'react-redux';
import { ChakraProvider } from "@chakra-ui/react";
import HomeUser from './Components/userSide/HomeUser';
import SignupUser from './Components/userSide/SignupUser';
import LoginUser from './Components/userSide/LoginUser';
import LoginAdmin from './Components/adminSide/LoginAdmin';
import PrivateRoute, { UserRoute, InstructorRoute } from './Components/PrivateRoute/PrivateRoute'
import UsersList from './Components/adminSide/UsersList';
import InstructorsList from './Components/adminSide/InstructorsList';
import CategoryAdmin from './Components/adminSide/CategoryAdmin';
import CourseAdmin from './Components/adminSide/CourseAdmin'
import RegisterInstructor from './Components/instructorSide/RegisterInstructor';
import LoginInstructor from './Components/instructorSide/LoginInstructor';
import ProfileInstructor from './Components/instructorSide/ProfileInstructor';
import CourseInstructor from './Components/instructorSide/CourseInstructor';
import ChapterInstructor from './Components/instructorSide/ChapterInstructor';
import Chapters from './Components/userSide/Chapters';
import ChatUser from './Components/userSide/ChatUser';
import ChatInstructor from './Components/instructorSide/ChatInstructor';
import ChapterAdmin from './Components/adminSide/ChapterAdmin';
import Profile from './Components/userSide/Profile';
import CourseHistory from './Components/userSide/CourseHistory';
import Students from './Components/instructorSide/Students';
import InstructorDashboard from './Components/instructorSide/InstructorDashboard';
import AdminDashboard from './Components/adminSide/AdminDashboard';
import OrdersInstructor from './Components/instructorSide/OrdersInstructor';
import OrdersAdmin from './Components/adminSide/OrdersAdmin';



function App() {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<HomeUser />} />
            <Route path='/register' element={<SignupUser />} />
            <Route path='/login' element={<LoginUser />} />
            <Route path='/chapters' element={<UserRoute><Chapters /></UserRoute>} />
            <Route path='/chatuser' element={<UserRoute><ChatUser /></UserRoute>} />
            <Route path='/profile' element={<UserRoute><Profile /></UserRoute>} />
            <Route path='/coursehistory' element={<UserRoute><CourseHistory /></UserRoute>} />
            <Route path='/loginadmin' element={<LoginAdmin />} />
            <Route path='/admindashboard' element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path='/usersadmin' element={<PrivateRoute><UsersList /></PrivateRoute>} />
            <Route path='/instructorsadmin' element={<PrivateRoute><InstructorsList /></PrivateRoute>} />
            <Route path='/categoryadmin' element={<PrivateRoute><CategoryAdmin /></PrivateRoute>} />
            <Route path='/courseadmin' element={<PrivateRoute><CourseAdmin /></PrivateRoute>} />
            <Route path='/chapteradmin' element={<PrivateRoute><ChapterAdmin /></PrivateRoute>} />
            <Route path='/ordersadmin' element={<PrivateRoute><OrdersAdmin /></PrivateRoute>} />
            <Route path='/registerinstructor' element={<RegisterInstructor />} />
            <Route path='/logininstructor' element={<LoginInstructor />} />
            <Route path='/instructordashboard' element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
            <Route path='/courseinstructor' element={<InstructorRoute><CourseInstructor /></InstructorRoute>} />
            <Route path='/chapterinstructor' element={<InstructorRoute><ChapterInstructor /></InstructorRoute>} />
            <Route path='/profileinstructor' element={<InstructorRoute><ProfileInstructor /></InstructorRoute>} />
            <Route path='/chatinstructor' element={<InstructorRoute><ChatInstructor /></InstructorRoute>} />
            <Route path='/students' element={<InstructorRoute><Students /></InstructorRoute>} />
            <Route path='/ordersinstructor' element={<InstructorRoute><OrdersInstructor /></InstructorRoute>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  );
}

export default App;
