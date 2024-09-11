import React from "react";

interface Props {
  children: React.ReactNode;
}

const Button = ({ children }: Props) => {
  return (
    <button className="rounded-2xl px-4 py-2  bg-blue-500 text-blue-100 hover:bg-blue-600 duration-300 text-md font-bold">
      {children}
    </button>
  );
};

export default Button;
