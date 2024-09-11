import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition-none items-center gap-x-2 hidden md:flex">
        <Image
          src=""
          alt="logo"
          width={30}
          height={30}
        />
      </div>
    </Link>
  );
};

export default Logo;
