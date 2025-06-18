import React, { useContext, useState } from "react";
import Subjectslots from "./Subjectslots";
import { DataContext } from "../context/Datacontext";

export default function Subjectconfig() {
  const [theoryTime, setTheoryTime] = useState("morning"); // default value

  const handleChange = (event) => {
    setMorning(event.target.value === "morning");
    setTheoryTime(event.target.value);
  };
  const { selectedSubjects, setMorning } = useContext(DataContext);

  return (
    <div className="w-[65%] flex flex-col p-2 gap-2 overflow-y-scroll">
      {/* select-morning-evening */}
      <div className="w-full p-2 flex gap-3 items-center">
        <h2 className="font-medium font-mont text-[14px] select-none dark:text-white">
          Theory :
        </h2>
        {/* radio buttons for morning and evening */}
        <div className="flex gap-3">
          <label className="flex items-center gap-1 text-[13px] font-mont font-medium dark:text-white">
            <input
              type="radio"
              name="theoryTime"
              value="morning"
              checked={theoryTime === "morning"}
              onChange={handleChange}
            />
            Morning
          </label>

          <label className="flex items-center gap-1 text-[13px] font-mont font-medium dark:text-white">
            <input
              type="radio"
              name="theoryTime"
              value="evening"
              checked={theoryTime === "evening"}
              onChange={handleChange}
            />
            Evening
          </label>
        </div>
      </div>

      {/* show-subject-and-available-slots */}
      {Object.keys(selectedSubjects).length > 0
        ? Object.entries(selectedSubjects).map(([key, value]) => (
            <Subjectslots
              key={key}
              name={key.replace(/-(LAB|THEORY)$/, "")} // Clean subject name
              isLab={value.isLab}
            />
          ))
        : ""}
    </div>
  );
}
