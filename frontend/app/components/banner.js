"use client";
import React from "react";

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden pb-8 flex justify-center items-center">
      <video
        className="w-full max-h-[calc(100vh-100px)] h-full rounded-xl object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/banner-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
