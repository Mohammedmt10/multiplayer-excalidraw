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
    primary : "text-white cursor-pointer bg-green-700 text-xl rounded shadow-md shadow-green-800 hover:-translate-y-1 duration-300 ",
    secondary : "border-2 border-green-700 text-green-700 shadow-md cursor-pointer text-xl rounded hover:-translate-y-1 duration-300 "
  },
  size : {
    sm : "",
    md : "px-8 py-1.5 mx-3",
    lg : "w-full py-1.5 shadow-none hover:translate-y-0"
  }
}


export const Button = ({ children, varient , size , type}: ButtonProps) => {
  const className = `${buttonClass.varients[varient] + buttonClass.size[size]}`
  return (
    <button
      className={className}
      type={type}
    >
      {children}
    </button>
  );
};
