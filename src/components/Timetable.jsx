import React, { useContext } from "react";
import { DataContext } from "../context/Datacontext";

export default function Timetable() {
  const {
    theoryDataTimeTable,
    labDataTimeTable,
    showOnTimetable,
    validCombinations,
  } = useContext(DataContext);

  const weekdays = ["Tue", "Wed", "Thu", "Fri", "Sat"];
  const totalSlots = 12;

  const fixedColorPalette = [
    "#ffe0e0", // rose
    "#ddf4e4", // mint
    "#daf0ff", // sky blue
    "#ede3ff", // lilac
    "#fff4d6", // sand
    "#ffe9d6", // peach
    "#e0f0d6", // sage
  ];

  // Create subject metadata map from the current combination
  const slotToMetaMap = {};
  const currentCombination = validCombinations[showOnTimetable];

  if (currentCombination?.combination && currentCombination?.subjectsOrder) {
    currentCombination.combination.forEach((slotStr, index) => {
      const bgColor = fixedColorPalette[index % fixedColorPalette.length];
      const subject = currentCombination.subjectsOrder[index];
      const shortCode = subject.name.split("-")[0];
      const type = subject.isLab ? "LAB" : "THEORY";

      slotStr.split("+").forEach((slot) => {
        slotToMetaMap[slot.toLowerCase()] = {
          label: `${shortCode} - ${type}`,
          color: bgColor,
        };
      });
    });
  }

  const formatTime = (mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };

  return (
    <div className="w-full bg-white dark:bg-[#121212] p-4">
      <div className="grid grid-cols-[70px_repeat(12,minmax(100px,1fr))] gap-[3px] text-sm font-mont rounded-md">
        {/* Time Header */}
        <div className="bg-gray-100 dark:bg-[#1f1f1f] dark:text-white text-center py-3 font-semibold sticky left-0 z-10">
          Day
        </div>
        {[...Array(totalSlots)].map((_, i) => {
          const start = 8 * 60 + i * 60;
          const end = start + 50;
          return (
            <div
              key={i}
              className="bg-gray-100 dark:bg-[#1f1f1f] text-center dark:text-gray-400 p-3 font-semibold"
            >
              {formatTime(start)} - {formatTime(end)}
            </div>
          );
        })}

        {/* Weekday Rows */}
        {weekdays.map((day, rowIndex) => {
          const theoryRow = theoryDataTimeTable[rowIndex] || [];
          const labRow = labDataTimeTable[rowIndex] || [];

          return (
            <React.Fragment key={day}>
              <div className="bg-gray-100 dark:bg-[#1f1f1f] text-black dark:text-white flex justify-center items-center py-3 font-semibold sticky left-0 z-10">
                {day}
              </div>

              {Array.from({ length: totalSlots }).map((_, colIndex) => {
                const theorySlot = theoryRow[colIndex];
                const labSlot = labRow[colIndex];

                const slots = [
                  ...(Array.isArray(theorySlot) ? theorySlot : [theorySlot]),
                  ...(Array.isArray(labSlot) ? labSlot : [labSlot]),
                ].filter(Boolean);

                const activeSlot = slots.find(
                  (slot) => slotToMetaMap[slot?.toLowerCase()]
                );

                const meta = activeSlot
                  ? slotToMetaMap[activeSlot.toLowerCase()]
                  : null;

                return (
                  <div
                    key={colIndex}
                    className="min-h-[100px] flex items-center justify-center p-2 border  border-gray-200 dark:border-[#1f1f1f] text-black dark:text-white text-[13px] font-semibold text-center rounded-[5px]"
                    style={{
                      backgroundColor: meta ? meta.color : "#ffffff10",
                    }}
                  >
                    {/* {meta ? meta.label : slots.join(", ")} */}
                    {meta ? (
                      <h1 className="text-black">{meta.label}</h1>
                    ) : (
                      <h1>{slots.join(", ")}</h1>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      <div className="w-full flex flex-wrap gap-2 my-6">
        {currentCombination?.subjectsOrder.map((sub, index) => (
          <div className="relative bg-[#ededed] dark:bg-[#292929] flex justify-between items-center p-4 rounded-[8px]">
            <h2 className="font-mont font-medium text-[15px] select-none dark:text-white">
              {sub.name.replace(/\s*-?\s*(lab|theory)$/i, "")} -{" "}
              {currentCombination.combination[index]}
            </h2>
            {/* Lab or Theory Indicator */}
            <div
              className={`w-[15px] h-[2px] absolute bottom-0 ${
                sub.isLab ? "bg-[#6DBF9A]" : "bg-[#6D72BF]"
              }`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
