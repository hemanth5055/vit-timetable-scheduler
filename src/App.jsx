import React, { useContext, useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import Selectedsubjects from "./components/Selectedsubjects";
import Subjectconfig from "./components/Subjectconfig";
import Sidebar from "./components/Sidebar";
import Timetable from "./components/Timetable";
import { DataContext } from "./context/Datacontext";
import { FaCaretLeft } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Howtouse from "./components/Howtouse";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setIsInstructionsOpen(true); // Show instructions
      localStorage.setItem("hasVisited", "true"); // Mark as visited
    }
  }, []);
  const {
    findCombinations,
    handleNext,
    handlePrev,
    showOnTimetable,
    validCombinations,
  } = useContext(DataContext);

  return (
    <div className="w-full p-2 dark:bg-black relative pt-4">
      {/* github-link & How to use */}
      <div className="absolute flex items-center gap-2 right-2  top-0 cursor-pointer max-sm:hidden">
        <div
          className=" flex items-center gap-2 right-2 bg-[#ededed] dark:bg-[#212121] p-2 px-3 rounded-b-[5px] top-0 cursor-pointer max-sm:hidden"
          onClick={() => setIsInstructionsOpen(true)}
        >
          <h1 className="font-mont text-[14px] dark:text-gray-300 text-black font-medium">
            How to Use
          </h1>
          <IoArrowBack
            className="dark:text-gray-100 text-black rotate-[135deg]"
            size={18}
          />
        </div>

        <div className="flex items-center gap-2 right-2 bg-[#ededed] dark:bg-[#212121] p-2 px-3 rounded-b-[5px] top-0 cursor-pointer max-sm:hidden">
          <FaGithub className="dark:text-gray-100 text-black" size={18} />
          <h1 className="font-mont text-[14px] dark:text-gray-300 text-black font-medium">
            Github
          </h1>
        </div>
      </div>

      {/* Hero-page-1 */}
      <div
        className="w-full flex justify-between max-sm:flex-col"
        style={{ height: "calc(100vh - 100px)" }}
      >
        <Selectedsubjects sidebar={setIsSidebarOpen}></Selectedsubjects>
        <Subjectconfig></Subjectconfig>
      </div>
      {/* find-combinations-button */}
      <div className="w-full h-[80px] flex justify-center items-center">
        <div
          className="font-mont text-[14px] font-medium bg-[#ededed] dark:bg-[#1a1a1a] dark:text-white p-2 px-3 rounded-[5px] select-none cursor-pointer"
          onClick={findCombinations}
        >
          Find Combinations
        </div>
      </div>
      {/* Time-Table-Page */}
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center justify-between gap-2 px-4 mb-2">
          <div className="w-full gap-2 items-center flex">
            <div
              className="w-[35px] h-[35px] bg-[#F3F4F6] text-black dark:bg-[#1b1a1a] dark:text-white flex justify-center items-center rounded-[5px] cursor-pointer"
              onClick={handlePrev}
            >
              <FaCaretLeft />
            </div>
            <div
              className="w-[35px] h-[35px]  bg-[#F3F4F6] text-black dark:bg-[#1b1a1a] dark:text-white flex justify-center items-center rounded-[5px] cursor-pointer"
              onClick={handleNext}
            >
              <FaCaretLeft className="rotate-180" />
            </div>
          </div>
          {validCombinations?.length > 0 ? (
            <div className="font-mont dark:text-gray-400 right-0 font-medium select-none">
              {showOnTimetable + 1}/{validCombinations.length}
            </div>
          ) : (
            ""
          )}
        </div>
        <Timetable></Timetable>
      </div>

      {/* sidebar */}
      {isSidebarOpen ? (
        <Sidebar setIsSidebarOpen={setIsSidebarOpen}></Sidebar>
      ) : (
        ""
      )}
      {isInstructionsOpen ? (
        <Howtouse setIsInstructionsOpen={setIsInstructionsOpen}></Howtouse>
      ) : (
        ""
      )}
    </div>
  );
}
