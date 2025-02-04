import Image from "next/image";
import React from "react";

const NoResultFound = () => {
  return (
    <div className="flex flex-col items-center justify-center max-h-screen p-4">
      <Image
        height={200}
        width={200}
        src="/no-result-found.jpg"
        alt="No Result found"
        className="w-64 h-64 md:w-80 md:h-80 object-cover bg-center"
      />
    </div>
  );
};

export default NoResultFound;
