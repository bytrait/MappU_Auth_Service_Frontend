import React from 'react';
import InstitutionRegistrationForm from '../components/registration/InstitutionRegistrationForm';
import logo from '../assets/bytrait_logo.png';
import rightTop from '../assets/image1.png';
import rightBottom from '../assets/image2.png';

const InstitutionRegistration = () => {
    return (
        <div className="min-h-screen flex items-center">
        <div className="container mx-auto">
            <div className="flex flex-wrap">
                {/* Left side */}
                <div className="w-full md:w-5/12  p-8 ">
                    <div className="mb-6">
                        <img
                            src={logo}
                            alt="ByTrait Logo"
                            className="w-60 mb-4"
                        />
                        <h1 className="text-2xl font-semibold mb-2">Register Institution</h1>
                    </div>

                    <InstitutionRegistrationForm />
                </div>
                {/* Right side */}
                <div className="hidden md:block md:w-7/12 relative z-[-1]">
                    <img
                        src={rightTop}
                        alt="Top Decoration"
                        className="fixed top-0 right-0 w-150 h-150"
                    />
                    <img
                        src={rightBottom}
                        alt="Bottom Decoration"
                        className="fixed bottom-0 right-0 w-200 h-200"
                    />
                </div>

            </div>
        </div>
    </div>
    );
}

export default InstitutionRegistration;
