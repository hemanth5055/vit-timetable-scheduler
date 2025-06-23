import React, { useState } from "react";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import step1 from "../assets/1.png";
import step2 from "../assets/2.png";
import step3 from "../assets/3.png";
import step4 from "../assets/4.png";
import step5 from "../assets/5.png";

export default function Howtouse({ setIsInstructionsOpen }) {
  const [activePage, setActivePage] = useState(0);

  const instructions = [
    "Click 'Add Subject' to view available subjects.",
    "Select theory and lab components for each subject.",
    "Choose your preferred slots for each selected subject.",
    "Click the 'Find Combination' button to generate timetables.",
    "Review the generated timetable displayed below.",
  ];
  const imgs = [step1, step2, step3, step4, step5];

  const handleNext = () =>
    setActivePage((prev) => (prev + 1) % instructions.length);
  const handlePrev = () =>
    setActivePage(
      (prev) => (prev + instructions.length - 1) % instructions.length
    );

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-gray-100/40 dark:bg-gray-900/40"
        onClick={() => setIsInstructionsOpen(false)}
      />

      {/* Slider Content */}
      <div className="z-50 flex items-center gap-3 relative max-sm:gap-2 ">
        {/* Close Button */}
        <button
          className="absolute top-[-50px] cursor-pointer right-[-20px] text-black dark:text-white  text-2xl"
          onClick={() => setIsInstructionsOpen(false)}
        >
          <IoMdClose />
        </button>

        {/* Previous Arrow */}
        <div
          className="w-[40px] h-[40px] dark:bg-gray-800 bg-gray-300 rounded-full cursor-pointer flex justify-center items-center"
          onClick={handlePrev}
        >
          <IoMdArrowDropleft size={30} className="dark:text-white" />
        </div>

        {/* Instruction Box */}
        <div className="flex flex-col rounded-[10px] gap-4  items-center">
          <div className="w-[830px] h-[400px] flex items-center justify-center">
            {/* Placeholder for visuals / steps */}
            <img
              src={imgs[activePage]}
              className="w-full h-full rounded-[15px]  select-none"
            ></img>
          </div>
          <div className="dark:text-white text-center">
            <h1 className="font-mont text-[20px] select-none font-medium">
              {instructions[activePage]}
            </h1>
          </div>
        </div>

        {/* Next Arrow */}
        <div
          className="w-[40px] h-[40px] dark:bg-gray-800 bg-gray-300 rounded-full rotate-180 cursor-pointer flex justify-center items-center"
          onClick={handleNext}
        >
          <IoMdArrowDropleft size={30} className="dark:text-white" />
        </div>
      </div>
    </div>
  );
}
