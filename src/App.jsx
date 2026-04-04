// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LanguageSwitcher from './components/LanguageSwitcher';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Login from './pages/Login';
// import VerifyOtp from './pages/VerifyOtp';
import RegisterRole from './pages/RegisterRole';
import StudentRegistration from './pages/StudentRegistration';
import CounsellorRegistration from './pages/CounsellorRegistration';
import InstitutionRegistration from './pages/InstitutionRegistration';
import StudentDashboard from './pages/dashborad/StudentDashboard';
import CounsellorDashboard from './pages/dashborad/CounsellorDashboard';
import InstitutionDashboard from './pages/dashborad/InstitutionDashboard';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';

const App = () => (
  <>
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute isPublic>
            <Login />
          </PrivateRoute>
        }
      />
      {/* <Route path="/verify" element={<VerifyOtp />} /> */}
      <Route
        path="/role-selection"
        element={
          <PrivateRoute isPublic>
            <RegisterRole />
          </PrivateRoute>
        }
      />
      <Route
        path="/register/student"
        element={
          <PrivateRoute isPublic>
            <StudentRegistration />
          </PrivateRoute>
        }
      />
      <Route
        path="/register/counsellor"
        element={
          <PrivateRoute isPublic>
            <CounsellorRegistration />
          </PrivateRoute>
        }
      />
      <Route
        path="/register/institution"
        element={
          <PrivateRoute isPublic>
            <InstitutionRegistration />
          </PrivateRoute>
        }
      />

      {/* Private Routes */}
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/counsellor/dashboard"
        element={
          <PrivateRoute allowedRoles={['COUNSELLOR']}>
            <CounsellorDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/institution/dashboard"
        element={
          <PrivateRoute allowedRoles={['INSTITUTION']}>
            <InstitutionDashboard />
          </PrivateRoute>
        }
      />
       <Route
        path="/termsandconditions"
        element={
          <PrivateRoute isPublic>
            <TermsAndConditionsPage />
          </PrivateRoute>
        }
      />

    </Routes>
  </>
);

export default App;
