"use client";

import { useState, useEffect, use } from "react";
import { toast } from "react-toastify";

const Page = ({ params }) => {
  const slug = use(params);
  const [vendor, setVendor] = useState({});

  useEffect(() => {
    const fetchVendor = async (email) => {
      try {
        const encodedEmail = encodeURIComponent(email);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.error.message || "Error fetching vendor data.");
        } else {
          const vendorData = data.data[0];
          console.log(vendorData);
          setVendor(vendorData);
        }
      } catch (error) {
        toast.error("Error fetching vendor data.");
      }
    };
    if (slug) {
      fetchVendor(slug);
    }
  }, [slug]);

  return (
    <div>
      <h1>{slug}</h1>
      <div>
        <h2>{vendor.name}</h2>
        <p>{vendor.description}</p>
        <p>Email: {vendor.email}</p>
        <p>
          Location: {vendor.location?.city}, {vendor.location?.state},{" "}
          {vendor.location?.country}
        </p>
        <p>Rating: {vendor.rating}</p>
      </div>
    </div>
  );
};

export default Page;
