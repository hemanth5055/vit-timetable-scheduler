import React, { useContext, useState } from "react";
import { IoAdd } from "react-icons/io5";
import AvailableSubjects from "./AvailableSubjects";
import { DataContext } from "../context/Datacontext";

export default function Sidebar({ setIsSidebarOpen }) {
  const { theoryData, labData, searchTerm, setSearchTerm } =
    useContext(DataContext);

  const filteredTheory = Object.keys(theoryData).filter((sub) =>
    sub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLab = Object.keys(labData).filter((sub) =>
    sub.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Background Blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-gray-100/40 dark:bg-gray-900/40"
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="relative z-50 w-[70%] h-full bg-[#EDEDED] dark:bg-black p-4 py-6 shadow-lg flex flex-col max-sm:w-[100%]">
        {/* Close Button + Search */}
        <div className="w-full flex justify-between items-center mb-2">
          <div className="w-full px-2 flex justify-center items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[50%] max-sm:w-[90%] font-mont px-4 max-sm:my-2 text-[16px] h-[40px] outline-none bg-white dark:bg-[#292929] dark:text-white placeholder:dark:text-gray-300 rounded-full"
              placeholder="Search subjects.."
            />
          </div>

          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <IoAdd className="text-black rotate-45 dark:text-white" size={20} />
          </div>
        </div>

        {/* Theory and Lab Sections */}
        <div className="w-full flex gap-4 h-full">
          {/* Theory Section */}
          <div
            className="w-1/2 flex flex-col gap-2 pr-1 scrollbar-hidden overflow-y-scroll"
            style={{ height: "calc(100vh - 70px)" }}
          >
            <h2 className="font-mont font-medium text-[15px] select-none dark:text-white">
              Theory :
            </h2>
            {filteredTheory.length > 0 ? (
              filteredTheory.map((sub) => (
                <AvailableSubjects key={sub} name={sub} isLab={false} />
              ))
            ) : (
              <p className="text-sm text-red-500  dark:text-red-400 font-mont">
                No theory subjects found.
              </p>
            )}
          </div>

          {/* Lab Section */}
          <div
            className="w-1/2 flex flex-col gap-2 pr-1 scrollbar-hidden overflow-y-scroll"
            style={{ height: "calc(100vh - 70px)" }}
          >
            <h2 className="font-mont font-medium text-[15px] select-none dark:text-white">
              Lab :
            </h2>
            {filteredLab.length > 0 ? (
              filteredLab.map((sub) => (
                <AvailableSubjects key={sub} name={sub} isLab={true} />
              ))
            ) : (
              <p className="text-sm text-red-500 dark:text-red-400  font-mont">
                No lab subjects found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
