import React from "react";
interface Props {
  children: React.ReactNode;
}

const AuthenticationLayout = ({ children }: Props) => {
  return (
    <div className="w-full h-full bg-sky-200 flex items-center justify-center">
      {children}
    </div>
  );
};

export default AuthenticationLayout;
