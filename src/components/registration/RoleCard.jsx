// src/components/registration/RoleCard.jsx
import React from 'react';
import { MdSchool, MdSupportAgent, MdBusiness } from 'react-icons/md';

const icons = {
  Student: <MdSchool className="w-12 h-12 text-blue-500 mb-4 mx-auto" />,
  Counsellor: <MdSupportAgent className="w-12 h-12 text-green-500 mb-4 mx-auto" />,
  Institution: <MdBusiness className="w-12 h-12 text-purple-500 mb-4 mx-auto" />,
};

const RoleCard = ({ role, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(role)}
      className="cursor-pointer border border-gray-300 hover:border-blue-500 rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-200"
    >
      {icons[role]}
      <h2 className="text-lg font-semibold">{role}</h2>
    </div>
  );
};

export default RoleCard;
