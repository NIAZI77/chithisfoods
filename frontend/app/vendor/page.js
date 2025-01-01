"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../loading";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/vendor/dashboard");
  }, []);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Page;
