import React, { useContext } from "react";
import { IoAdd } from "react-icons/io5";
import { DataContext } from "../context/Datacontext";

export default function AvailableSubjects({ name, isLab }) {
  const { setSelectedSubjects } = useContext(DataContext);

  const handleAdd = () => {
    const subjectKeyWithType = `${name}-${isLab ? "LAB" : "THEORY"}`;
    setSelectedSubjects((prev) => {
      if (prev[subjectKeyWithType]) return prev;
      return {
        ...prev,
        [subjectKeyWithType]: {
          slots: [],
          isLab: isLab,
        },
      };
    });
  };

  return (
    <div className="relative w-full bg-white dark:bg-[#292929] flex justify-between items-center p-2 py-3 rounded-[8px]">
      <h2 className="font-mont font-medium text-[15px] max-sm:text-[12px] select-none dark:text-white">
        {name}
      </h2>

      <div
        className="w-[30px] h-[30px] rounded-full bg-white dark:bg-[#383838] flex justify-center items-center cursor-pointer"
        onClick={handleAdd}
      >
        <IoAdd size={20} className="dark:text-white" />
      </div>

      {/* Lab or Theory Indicator */}
      <div
        className={`w-[15px] h-[2px] absolute bottom-0 ${
          isLab ? "bg-[#6DBF9A]" : "bg-[#6D72BF]"
        }`}
      ></div>
    </div>
  );
}
