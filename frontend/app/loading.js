import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div
     className="flex items-center justify-center h-screen bg-white fixed inset-0 w-screen z-40"
    >
      <Image
        src="/logo.png"
        alt="Logo"
        width={288}
        height={288}
        className="object-contain zoom-animation"
        priority={true}
        quality={100}
      />
    </div>
  );
};

export default Loading;
