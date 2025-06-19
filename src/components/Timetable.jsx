import React, { useContext } from "react";
import { DataContext } from "../context/Datacontext";

export default function Timetable() {
  const { theoryDataTimeTable, labDataTimeTable, showOnTimetable } =
    useContext(DataContext);

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

  // Mapping each slot to subject info
  const slotToMetaMap = {};
  if (showOnTimetable?.combination && showOnTimetable?.subjectsOrder) {
    showOnTimetable.combination.forEach((slotStr, index) => {
      const bgColor = fixedColorPalette[index % fixedColorPalette.length];
      const subjectObj = showOnTimetable.subjectsOrder[index];
      const shortLabel = subjectObj.name.split("-")[0]; // e.g., CSE1005
      const type = subjectObj.isLab ? "LAB" : "THEORY";

      slotStr.split("+").forEach((part) => {
        slotToMetaMap[part.toLowerCase()] = {
          label: `${shortLabel} - ${type}`,
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
    <div className="w-full h-screen overflow-auto bg-white dark:bg-[#121212] p-4">
      <div className="grid grid-cols-[70px_repeat(12,minmax(100px,1fr))] w-full h-full gap-[3px] text-sm text-center font-mont rounded-md overflow-hidden">
        {/* Header Row */}
        <div className="bg-gray-100 dark:bg-[#1f1f1f] dark:text-gray-400 py-3 font-semibold sticky left-0 z-10">
          Day
        </div>
        {[...Array(totalSlots)].map((_, i) => {
          const startMinutes = 8 * 60 + i * 60;
          const endMinutes = startMinutes + 50;
          return (
            <div
              key={i}
              className="bg-gray-100 dark:bg-[#1f1f1f] dark:text-gray-400 p-3 font-semibold"
            >
              {formatTime(startMinutes)} - {formatTime(endMinutes)}
            </div>
          );
        })}

        {/* Time Rows */}
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

                const allSlots = [
                  ...(Array.isArray(theorySlot) ? theorySlot : [theorySlot]),
                  ...(Array.isArray(labSlot) ? labSlot : [labSlot]),
                ].filter(Boolean);

                // Find if any slot is part of combination
                const activeSlot = allSlots.find(
                  (slot) => slotToMetaMap[slot?.toLowerCase()]
                );
                const slotMeta = activeSlot
                  ? slotToMetaMap[activeSlot.toLowerCase()]
                  : null;

                return (
                  <div
                    key={colIndex}
                    className={`text-black dark:text-white p-2 min-h-[60px] flex flex-col items-center justify-center border border-gray-200 dark:border-[#1f1f1f]`}
                    style={{
                      backgroundColor: slotMeta ? slotMeta.color : "#ffffff10",
                    }}
                  >
                    {slotMeta ? (
                      <span className="text-[13px] font-semibold text-black">
                        {slotMeta.label}
                      </span>
                    ) : (
                      allSlots.map((s, i) => (
                        <span
                          key={i}
                          className="text-[12px] text-gray-500 font-medium font-mont dark:text-gray-400"
                        >
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
