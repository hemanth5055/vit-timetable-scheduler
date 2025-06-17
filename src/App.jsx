import React from "react";
import Selectedsubjects from "./components/Selectedsubjects";
import Subjectconfig from "./components/Subjectconfig";

export default function App() {
  return (
    <div className="w-full p-2">
      {/* Hero-page-1 */}
      <div className="w-full flex justify-between" style={{ height: "calc(100vh - 80px)" }}>
        <Selectedsubjects></Selectedsubjects>
        <Subjectconfig></Subjectconfig>
      </div>
      {/* Time-Table-Page */}
      <div className="w-full"></div>
    </div>
  );
}
