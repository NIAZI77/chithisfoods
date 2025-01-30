"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import { FaStar } from "react-icons/fa";
import ProductCard from "@/app/components/productCard";
import Loading from "@/app/loading";
import Custom404 from "@/app/not-found";

const Page = () => {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${slug}?populate=*`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setVendor(data.data);
        } else {
          toast.error(data.error?.message || "An error occurred");
        }
      } catch (error) {
        console.error("Error fetching vendor:", error);
        toast.error("An error occurred while fetching the vendor");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchVendor();
    }
  }, [slug]);

  if (loading) return <Loading />;

  if (!vendor) return <Custom404 />;

  return (
    <div className="container mx-auto w-[80%] p-4">
      <div
        className="md:h-96 h-36 relative bg-cover bg-center mt-6"
        style={{
          backgroundImage: vendor.coverImage.url && `url('${vendor.coverImage.url}')`,
        }}
      >
        <div className="absolute md:bottom-[-60px] bottom-[-50px] left-1/2 transform -translate-x-1/2 md:w-32 md:h-32 w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-red-400">
          <img
            height={100}
            width={100}
            src={vendor.logo?.url || ""}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold md:mt-20 mt-14 text-center">
          <div className="flex items-center justify-center space-x-4 select-text">
            <div>{vendor.name}</div>
            <div className="flex items-center justify-center text-orange-300">
              <FaStar className="pr-1" />
              {vendor.rating}
            </div>
          </div>
        </h1>
        <p className="text-center pt-2 font-semibold">
          {vendor.location.country
            .split(" ")
            .map(
              (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ")}{" "}
          ·{" "}
          {vendor.location.state
            .split(" ")
            .map(
              (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ")}{" "}
          ·{" "}
          {vendor.location.city
            .split(" ")
            .map(
              (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join(" ")}
        </p>
        <p className="text-center pt-2">{vendor.description}</p>
      </div>
      <div className="pt-24">
        <h2 className="text-2xl text-center font-bold">Menu</h2>
        <ul className="flex items-center justify-center flex-wrap">
          {vendor.menu && vendor.menu.length > 0 ? (
            vendor.menu.map((item,index) => (
              <li key={index}>
                <ProductCard
                  product={item}
                  logo={vendor.logo}
                  location={vendor.location}
                  documentId={vendor.documentId}
                />
              </li>
            ))
          ) : (
            <div className="text-center w-full">No Menu Available</div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Page;
