import React, { useContext } from "react";
import { IoIosAdd } from "react-icons/io";
import Selecteditem from "./SelectedSubjectsItem";
import { DataContext } from "../context/Datacontext";

export default function Selectedsubjects({ sidebar }) {
  const { selectedSubjects } = useContext(DataContext);
  return (
    <div className="w-[30%] flex flex-col p-2 gap-4 max-sm:w-full max-sm:h-[50%]">
      {/* menu-bar */}
      <div className="w-full flex justify-between items-center ">
        {/* add subject button */}
        <div
          className="p-2 px-3 gap-2 flex bg-[#ededed] dark:bg-[#292929] rounded-[10px] items-center cursor-pointer"
          onClick={() => sidebar(true)}
        >
          <div className="flex justify-between items-center">
            <IoIosAdd size={20} className="dark:text-white"></IoIosAdd>
          </div>
          <h2 className="font-medium font-mont text-[13px] select-none dark:text-white">
            Add Subject
          </h2>
        </div>

        {/* color-indicatiors */}
        <div className="flex gap-3 items-center">
          {/* theory */}
          <div className="flex items-center gap-1">
            <div className="w-[20px] h-[20px] rounded-full bg-[#6D72BF]"></div>
            <h2 className="font-medium font-mont text-[12px] select-none dark:text-white">
              Theory
            </h2>
          </div>
          {/* lab */}
          <div className="flex items-center gap-1">
            <div className="w-[20px] h-[20px] rounded-full bg-[#6DBF9A]"></div>
            <h2 className="font-medium font-mont text-[12px] select-none dark:text-white">
              Lab
            </h2>
          </div>
        </div>
      </div>
      {/* show-selected-subject */}
      <div className="w-full flex flex-col h-full scrollbar-hidden overflow-y-scroll gap-3">
        {/* subject-item */}
        {Object.keys(selectedSubjects).length > 0 ? (
          Object.entries(selectedSubjects).map(([key, value]) => (
            <Selecteditem
              key={key}
              name={key.replace(/-(LAB|THEORY)$/, "")} // optional: remove "-LAB"/"-THEORY" suffix
              isLab={value.isLab}
            />
          ))
        ) : (
          <h2 className="font-medium font-mont text-[12px] select-none text-red-400">
            * No Subjects Selected
          </h2>
        )}
      </div>
    </div>
  );
}
