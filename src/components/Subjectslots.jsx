import React, { useContext } from "react";
import { DataContext } from "../context/Datacontext";

export default function Subjectslots({ name, isLab }) {
  const { theoryData, labData, selectedSubjects, setSelectedSubjects } =
    useContext(DataContext);

  const subjectKey = `${name}-${isLab ? "LAB" : "THEORY"}`;
  const slots = isLab ? labData[name] : theoryData[name];
  const selectedSlots = selectedSubjects[subjectKey]?.slots || [];

  const handleCheckboxChange = (slot) => {
    // update-slots-locally
    const updatedSlots = selectedSlots.includes(slot)
      ? selectedSlots.filter((s) => s !== slot)
      : [...selectedSlots, slot];

    //update-slots-in-context
    setSelectedSubjects((prev) => ({
      ...prev,
      [subjectKey]: {
        ...prev[subjectKey],
        slots: updatedSlots,
        isLab,
      },
    }));
  };

  return (
    <div className="w-full flex flex-col p-2 gap-4">
      {/* show-name-and-type */}
      <div className="w-full flex gap-2 items-center">
        <h2 className="font-medium font-mont text-[20px] select-none dark:text-white">
          {name}
        </h2>
        <div
          className={`w-[15px] h-[15px] ${
            isLab ? "bg-[#6DBF9A]" : "bg-[#6D72BF]"
          } rounded-full`}
        ></div>
      </div>

      {/* show-slots-with-checkbox */}
      <div className="w-full flex gap-4 flex-wrap items-center">
        {slots?.map((slot) => (
          <div key={slot} className="flex gap-2 items-center">
            <input
              type="checkbox"
              onChange={() => handleCheckboxChange(slot)}
              checked={selectedSlots.includes(slot)}
              className="w-5 h-5 appearance-none border border-gray-400 dark:border-gray-600 rounded bg-white dark:bg-gray-700 checked:bg-blue-400 transition-colors duration-200"
            />
            <h2 className="font-medium font-mont text-[15px] select-none dark:text-white">
              {slot}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
