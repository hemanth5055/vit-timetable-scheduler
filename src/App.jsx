import React, { useContext, useState } from "react";
import Selectedsubjects from "./components/Selectedsubjects";
import Subjectconfig from "./components/Subjectconfig";
import Sidebar from "./components/Sidebar";
import Timetable from "./components/Timetable";
import { DataContext } from "./context/Datacontext";
import { FaCaretLeft } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { findCombinations, handleNext, handlePrev } = useContext(DataContext);

  return (
    <div className="w-full p-2 dark:bg-black relative">
      {/* github-link */}
      <div className="absolute flex items-center gap-2 right-2 bg-[#ededed] dark:bg-[#212121] p-2 px-3 rounded-b-[5px] top-0 cursor-pointer max-sm:hidden">
        <FaGithub className="dark:text-gray-100 text-black" size={18} />
        <h1 className="font-mont dark:text-gray-400 text-black font-medium">Github</h1>
      </div>
      {/* Hero-page-1 */}
      <div
        className="w-full flex justify-between max-sm:flex-col"
        style={{ height: "calc(100vh - 80px)" }}
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
      <div className="w-full flex flex-col ">
        <div className="w-full flex items-center gap-2 px-4 my-2">
          <div
            className="w-[35px] h-[35px] bg-[black] text-white dark:bg-[#ededed] dark:text-black flex justify-center items-center rounded-[5px] cursor-pointer"
            onClick={handlePrev}
          >
            <FaCaretLeft />
          </div>
          <div
            className="w-[35px] h-[35px] bg-[black] text-white dark:bg-[#ededed] dark:text-black flex justify-center items-center rounded-[5px] cursor-pointer"
            onClick={handleNext}
          >
            <FaCaretLeft className="rotate-180" />
          </div>
        </div>
        <Timetable></Timetable>
      </div>

      {/* sidebar */}
      {isSidebarOpen ? (
        <Sidebar setIsSidebarOpen={setIsSidebarOpen}></Sidebar>
      ) : (
        ""
      )}
    </div>
  );
}
