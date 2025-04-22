import { useRouter } from "next/navigation";
import React from "react";
import Loading from "../loading";

const Page = () => {
  const router = useRouter();
  router.push("/vendor/dashboard");
  return <Loading />;
};

export default Page;
