"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Loading from "../loading";

const Page = () => {
  const router = useRouter();
  router.push("/profile/order-history");
  return <Loading />;
};

export default Page;
