import React from "react";
import { IoIosAdd } from "react-icons/io";

export default function Selecteditem() {
  return (
    <div className="relative w-full bg-[#ededed] flex justify-between items-center p-2 py-3 rounded-[8px]">
      <h2 className="font-mont font-medium text-[15px] select-none ">
        Applied Statistics
      </h2>
      <div className="w-[30px] h-[30px] rounded-full bg-white flex justify-center items-center rotate-45 cursor-pointer">
        <IoIosAdd size={20}></IoIosAdd>
      </div>
      {/* Indicate-lab-or-theory lab : 6DBF9A*/}
      <div className="w-[15px] h-[2px] bg-[#6D72BF] absolute bottom-0"></div>
    </div>
  );
}
