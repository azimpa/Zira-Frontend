import React, { useEffect } from 'react';
import NavBar from './NavBar';
import Hero from './Hero';
import CardHome from './CardHome';
import Footer from './Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseState } from '../../Redux/courseActions';

const HomeUser = () => {
  const dispatch = useDispatch();

  const { courses, loading, error } = useSelector(state => state.course);

  useEffect(() => {
    dispatch(fetchCourseState());
  }, [dispatch, courses]);

  return (
    <>
      <NavBar/>
      <Hero />
      <CardHome courses={courses} loading={loading} error={error} />
      <Footer />
    </>
  );
};

export default HomeUser;
