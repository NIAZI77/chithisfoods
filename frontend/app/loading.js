import React from "react";

const Loading = () => {
  return (
    <div
     className="flex items-center justify-center h-screen bg-white fixed inset-0 w-screen z-40"
    >
      <img
        src="/logo.png"
        alt="Logo"
        className="object-contain zoom-animation w-72 h-auto max-w-1/2"
      />
    </div>
  );
};

export default Loading;
