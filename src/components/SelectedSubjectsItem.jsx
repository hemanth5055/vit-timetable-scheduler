import React, { useContext } from "react";
import { IoIosAdd } from "react-icons/io";
import { DataContext } from "../context/Datacontext";

export default function Selecteditem({ name, isLab }) {
  const { setSelectedSubjects } = useContext(DataContext);
  const subjectKey = `${name}-${isLab ? "LAB" : "THEORY"}`;

  const handleRemoveSubject = () => {
    setSelectedSubjects((prev) => {
      const updated = { ...prev };
      delete updated[subjectKey];
      return updated;
    });
  };

  return (
    <div className="relative w-full bg-[#ededed] dark:bg-[#292929] flex justify-between items-center p-2 py-3 rounded-[8px]">
      <h2 className="font-mont font-medium text-[13px] select-none dark:text-white">
        {name}
      </h2>
      <div
        onClick={handleRemoveSubject}
        className="w-[30px] h-[30px] rounded-full bg-white dark:bg-[#383838] flex justify-center items-center rotate-45 cursor-pointer"
      >
        <IoIosAdd size={20} className="dark:text-white" />
      </div>
      {/* Indicate-lab-or-theory */}
      <div
        className={`w-[15px] h-[2px] absolute bottom-0 ${
          isLab ? "bg-[#6DBF9A]" : "bg-[#6D72BF]"
        }`}
      ></div>
    </div>
  );
}
