// import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white fixed inset-0 w-screen z-50">
      <img
        // height={48}
        // width={48}
        src="/logo.png"
        alt="Logo"
        className="object-contain w-72 zoom-animation"
        // priority={true}
        // quality={100}
      />
    </div>
  );
};

export default Loading;
