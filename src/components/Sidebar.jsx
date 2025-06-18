import React, { useContext } from "react";
import { IoAdd } from "react-icons/io5";
import AvailableSubjects from "./AvailableSubjects";
import { DataContext } from "../context/Datacontext";

export default function Sidebar({ setIsSidebarOpen }) {
  const { theoryData, labData } = useContext(DataContext);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Background Blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-gray-100/40 dark:bg-gray-900/40"
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="relative z-50 w-[70%] h-full bg-[#EDEDED] dark:bg-black p-4 shadow-lg flex flex-col">
        {/* Close Button */}
        <div className="w-full flex justify-end mb-2">
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <IoAdd className="text-black rotate-45 dark:text-white" size={20} />
          </div>
        </div>

        {/* Theory and Lab Sections Side-by-Side */}
        <div className="w-full flex gap-4 h-full">
          {/* Theory Section */}
          <div
            className="w-1/2 flex flex-col gap-2 overflow-y-auto pr-1"
            style={{ maxHeight: "100%" }}
          >
            <h2 className="font-mont font-medium text-[13px] select-none dark:text-white">
              Theory :
            </h2>
            {Object.keys(theoryData).map((sub) => (
              <AvailableSubjects key={sub} name={sub} isLab={false} />
            ))}
          </div>

          {/* Lab Section */}
          <div
            className="w-1/2 flex flex-col gap-2 overflow-y-auto pr-1"
            style={{ maxHeight: "100%" }}
          >
            <h2 className="font-mont font-medium text-[13px] select-none dark:text-white">
              Lab :
            </h2>
            {Object.keys(labData).map((sub) => (
              <AvailableSubjects key={sub} name={sub} isLab={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
