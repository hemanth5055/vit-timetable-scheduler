import React, { useState } from "react";
import Subjectslots from "./Subjectslots";

export default function Subjectconfig() {
  const [theoryTime, setTheoryTime] = useState("morning"); // default value

  const handleChange = (event) => {
    setTheoryTime(event.target.value);
  };

  return (
    <div className="w-[65%] flex flex-col p-2 gap-2 overflow-y-scroll">
      {/* select-morning-evening */}
      <div className="w-full p-2 flex gap-3 items-center">
        <h2 className="font-medium font-mont text-[14px] select-none">
          Theory :
        </h2>
        {/* radio buttons for morning and evening */}
        <div className="flex gap-3">
          <label className="flex items-center gap-1 text-[13px] font-mont font-medium">
            <input
              type="radio"
              name="theoryTime"
              value="morning"
              checked={theoryTime === "morning"}
              onChange={handleChange}
            />
            Morning
          </label>

          <label className="flex items-center gap-1 text-[13px] font-mont font-medium">
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
      <Subjectslots></Subjectslots>
      <Subjectslots></Subjectslots>
      <Subjectslots></Subjectslots>
      <Subjectslots></Subjectslots>
    </div>
  );
}
