// src/components/registration/RoleSelection.jsx
import React from 'react';
import RoleCard from './RoleCard';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate(`/register/${role.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center mb-8">Select Your Role</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <RoleCard role="Student" onSelect={handleSelect} />
          <RoleCard role="Counsellor" onSelect={handleSelect} />
          <RoleCard role="Institution" onSelect={handleSelect} />
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
