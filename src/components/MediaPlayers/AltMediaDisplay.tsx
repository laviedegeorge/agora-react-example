import React from "react";
import { getInitials } from "../../utils/funcs";

const AltMediaDisplay = ({
  firstName,
  lastName,
  bgColor,
  textColor,
  variant = "normal"
}: {
  firstName: string;
  lastName: string;
  textColor: string;
  bgColor: string;
  variant: "small" | "normal";
}) => {
  const initials = getInitials(`${firstName} ${lastName}`);
  return (
    <>
      {variant === "normal" && (
        <div className="w-full h-full flex justify-center items-center relative">
          <div className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] scale-up-center bg-slate-700 rounded-full absolute z-0"></div>

          <div
            className={`w-[200px] h-[200px] md:w-[250px] md:h-[250px] ${bgColor} flex justify-center items-center rounded-full relative z-10`}
          >
            <p className={`${textColor} text-xl md:text-2xl lg:text-5xl`}>
              {initials}
            </p>
          </div>
        </div>
      )}

      {variant === "small" && (
        <div className="w-full h-full flex justify-center items-center relative">
          <div className="w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:w-[250px] lg:h-[250px] scale-up-center bg-slate-700 rounded-full absolute z-0"></div>

          <div
            className={`w-[70px] h-[70px] md:w-[70px] md:h-[70px] lg:w-[250px] lg:h-[250px] ${bgColor} flex justify-center items-center rounded-full relative z-10`}
          >
            <p className={`${textColor} text-sm md:text-base lg:text-5xl`}>
              {initials}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AltMediaDisplay;
