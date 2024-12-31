"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../loading";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const isVendor = async () => {
      const email = sessionStorage.getItem("user");
      if (!email) {router.push("/login")};

      const encodedEmail = encodeURIComponent(email);

      try {
        const response = await fetch(
          `http://localhost:1337/api/vendors?filters[email][$eq]=${encodedEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }

        const data = await response.json();

        if (!(data && data.data && data.data.length > 0)) {
          router.push("/become-vendor");
        }
      } catch (error) {
        console.error("Error while checking vendor status:", error);
      }
    };

    isVendor();
    router.push("/vendor/dashboard");
  }, []);

  return (
    <div>
      <Loading />
    </div>
  );
};

export default Page;
