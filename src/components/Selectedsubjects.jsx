import React from "react";
import { IoIosAdd } from "react-icons/io";
import Selecteditem from "./Selecteditem";

export default function Selectedsubjects() {
  return (
    <div className="w-[30%] flex flex-col p-2 gap-4">
      {/* menu-bar */}
      <div className="w-full flex justify-between items-center ">
        {/* add subject button */}
        <div className="p-2 px-3 gap-2 flex bg-[#ededed] rounded-[10px] items-center cursor-pointer">
          <div className="flex justify-between items-center">
            <IoIosAdd size={20}></IoIosAdd>
          </div>
          <h2 className="font-medium font-mont text-[13px] select-none">
            Add Subject
          </h2>
        </div>

        {/* color-indicatiors */}
        <div className="flex gap-3 items-center">
          {/* theory */}
          <div className="flex items-center gap-1">
            <div className="w-[20px] h-[20px] rounded-full bg-[#6D72BF]"></div>
            <h2 className="font-medium font-mont text-[12px] select-none">
              Theory
            </h2>
          </div>
          {/* lab */}
          <div className="flex items-center gap-1">
            <div className="w-[20px] h-[20px] rounded-full bg-[#6DBF9A]"></div>
            <h2 className="font-medium font-mont text-[12px] select-none">
              Lab
            </h2>
          </div>
        </div>
      </div>
      {/* show-selected-subject */}
      <div className="w-full flex flex-col h-full overflow-y-scroll gap-3">
        {/* subject-item */}
        <Selecteditem></Selecteditem>
        <Selecteditem></Selecteditem>
        <Selecteditem></Selecteditem>
        <Selecteditem></Selecteditem>
        <Selecteditem></Selecteditem>
        <Selecteditem></Selecteditem>
      </div>
    </div>
  );
}
