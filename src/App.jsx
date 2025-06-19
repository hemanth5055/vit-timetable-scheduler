import React, { useContext, useState } from "react";
import Selectedsubjects from "./components/Selectedsubjects";
import Subjectconfig from "./components/Subjectconfig";
import Sidebar from "./components/Sidebar";
import Timetable from "./components/Timetable";
import { DataContext } from "./context/Datacontext";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { findCombinations } = useContext(DataContext);

  return (
    <div className="w-full p-2 dark:bg-black">
      {/* Hero-page-1 */}
      <div
        className="w-full flex justify-between"
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
      <div className="w-full">
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
