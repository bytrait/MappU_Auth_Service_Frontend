import React from 'react';
import StudentRegistrationForm from '../components/registration/StudentRegistrationForm';
import logo from '../assets/bytrait_logo.png';
import rightTop from '../assets/image1.png';
import rightBottom from '../assets/image2.png';
const StudentRegistration = () => {
    return (
        <div className="bg-[#012A9E] p-4 min-h-screen">
            <StudentRegistrationForm />
        </div>
    );
}

export default StudentRegistration;
