import React from "react";

const AuthenLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-full flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: "url('/images/2.jpg')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
};

export default AuthenLayout;
