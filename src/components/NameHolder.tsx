import React from "react";

export const NameHolder = ({ name }: { name: string }) => {
  return (
    <div className="flex">
      <div className="flex justify-center items-center bg-[#fefeff12] text-center rounded-l-full rounded-r-full px-2 lg:px-5 py-1 lg:py-2">
        <p className=" text-white text-xs md:text-sm lg:text-base">{name}</p>
      </div>
    </div>
  );
};
