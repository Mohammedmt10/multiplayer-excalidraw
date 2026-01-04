"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  varient: "primary" | "secondary";
  size : "sm" | "md" | "lg";
  type : "submit" | "button"
}
const buttonClass = {
  varients : {
    primary : "text-white bg-gradientBlue rounded ",
    secondary : "text-white bg-textColor rounded "
  },
  size : {
    sm : " px-10 my-1 shadow-[0_2px_5px_rgba(0,0,0,0.4)]",
    md : " px-10 py-1 shadow-[0_4px_5px_rgba(0,0,0,0.4)]",
    lg : " w-full py-1.5 shadow-[0_2px_5px_rgba(0,0,0,0.4)]"
  }
}


export const Button = ({ children, varient , size , type}: ButtonProps) => {
  const className = `${buttonClass.varients[varient] + buttonClass.size[size]} cursor-pointer`
  return (
    <button
      className={className}
      type={type}
    >
      {children}
    </button>
  );
};
