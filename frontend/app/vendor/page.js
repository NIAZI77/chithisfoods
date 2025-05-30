"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Loading from "../loading";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/vendor/dashboard");
  }, [router]);

  return <Loading />;
};

export default Page;
