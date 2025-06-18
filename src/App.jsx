import React, { useState } from "react";
import Selectedsubjects from "./components/Selectedsubjects";
import Subjectconfig from "./components/Subjectconfig";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      {/* Time-Table-Page */}
      <div className="w-full"></div>

      {/* sidebar */}
      {isSidebarOpen ? (
        <Sidebar setIsSidebarOpen={setIsSidebarOpen}></Sidebar>
      ) : (
        ""
      )}
    </div>
  );
}
