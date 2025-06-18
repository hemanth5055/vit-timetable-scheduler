import React from "react";
import { IoIosAdd } from "react-icons/io";

export default function Selecteditem({ name, isLab }) {
  return (
    <div className="relative w-full bg-[#ededed] dark:bg-[#292929] flex justify-between items-center p-2 py-3 rounded-[8px]">
      <h2 className="font-mont font-medium text-[13px] select-none dark:text-white">
        {name}
      </h2>
      <div className="w-[30px] h-[30px] rounded-full bg-white dark:bg-[#383838] flex justify-center items-center rotate-45 cursor-pointer">
        <IoIosAdd size={20} className="dark:text-white"></IoIosAdd>
      </div>
      {/* Indicate-lab-or-theory lab : 6DBF9A*/}
      <div
        className={`w-[15px] h-[2px] absolute bottom-0 ${
          isLab ? "bg-[#6DBF9A]" : "bg-[#6D72BF]"
        }`}
      ></div>
    </div>
  );
}
