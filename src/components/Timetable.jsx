import React, { useContext } from "react";
import { DataContext } from "../context/Datacontext";

export default function Timetable() {
  const { theoryDataTimeTable, labDataTimeTable } = useContext(DataContext);
  const weekdays = ["Tue", "Wed", "Thu", "Fri", "Sat"];
  const totalSlots = 12;

  const formatTime = (mins) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  };

  return (
    <div className="w-full h-screen overflow-auto bg-white dark:bg-[#121212] p-4">
      <div className="grid grid-cols-[70px_repeat(12,minmax(100px,1fr))] w-full h-full gap-px text-sm text-center font-mont rounded-md overflow-hidden">
        
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

        {/* Data Rows */}
        {weekdays.map((day, rowIndex) => {
          const theoryRow = theoryDataTimeTable[rowIndex] || [];
          const labRow = labDataTimeTable[rowIndex] || [];

          return (
            <React.Fragment key={day}>
              {/* Day Label */}
              <div className="bg-gray-100 dark:bg-[#1f1f1f] text-black dark:text-gray-400 flex justify-center items-center py-3 font-semibold sticky left-0 z-10">
                {day}
              </div>

              {/* Time Slots */}
              {Array.from({ length: totalSlots }).map((_, colIndex) => {
                const theorySlot = theoryRow[colIndex] || "";
                const labSlot = labRow[colIndex] || "";
                const isEmpty = !theorySlot && !labSlot;
                return (
                  <div
                    key={colIndex}
                    className={`bg-white dark:bg-[#262626] text-black dark:text-white p-2 min-h-[60px] flex flex-col items-center justify-center border gap-2 border-gray-200 dark:border-[#1f1f1f] ${
                      isEmpty ? "opacity-40" : ""
                    }`}
                  >
                    {theorySlot && (
                      <span className="text-[15px] font-semibold">
                        {Array.isArray(theorySlot)
                          ? theorySlot.join(", ")
                          : theorySlot}
                      </span>
                    )}
                    {labSlot && (
                      <span className="text-[15px] font-semibold ">
                        {Array.isArray(labSlot)
                          ? labSlot.join(", ")
                          : labSlot}
                      </span>
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
