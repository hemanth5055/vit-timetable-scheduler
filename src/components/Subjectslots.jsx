import React, { useState } from "react";

export default function Subjectslots() {
  const [selectedSlots, setSelectedSlots] = useState([]);

  const handleCheckboxChange = (slot) => {
    setSelectedSlots(
      (prev) =>
        prev.includes(slot)
          ? prev.filter((s) => s !== slot) // remove if already selected
          : [...prev, slot] // add if not selected
    );
  };

  const slots = ["A1", "B1", "C1", "D1", "E1"];

  return (
    <div className="w-full flex flex-col p-2 gap-2">
      {/* show-name-and-type */}
      <div className="w-full flex gap-2 items-center">
        <h2 className="font-medium font-mont text-[20px] select-none">
          Applied Statistics
        </h2>
        <div className="w-[15px] h-[15px] bg-[#6D72BF] rounded-full"></div>
      </div>

      {/* show-slots-with-checkbox */}
      <div className="w-full flex gap-8">
        {slots.map((slot) => (
          <div key={slot} className="flex gap-2">
            <input
              type="checkbox"
              checked={selectedSlots.includes(slot)}
              onChange={() => handleCheckboxChange(slot)}
            />
            <h2 className="font-medium font-mont text-[16px] select-none">
              {slot}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
