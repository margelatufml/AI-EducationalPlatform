import React from "react";

const SubjectCard = ({ name, onClick }) => {
  return (
    <div
      className="max-w-xs rounded text-white overflow-hidden  bg-airforce-princeton cursor-pointer moving-border rainbow hover:text-gray-500 shadow-"
      onClick={onClick}
    >
      <div className="px-6 py-4 ">
        <div className="font-bold text-xl mb-2">{name}</div>
      </div>
    </div>
  );
};

export default SubjectCard;
