"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import ProductCard from "@/app/components/DishCard";
import { BadgeCheck } from "lucide-react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState(null);
  const [menu, setMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  let { username } = useParams();
  username = username.replace(/%40/g, "");

  useEffect(() => {
    getVendor(username);
  }, [username]);

  const getVendorMenu = async (id) => {
    setMenuLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[vendorId][$eq]=${id}&populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.data) {
        setMenu(data.data);
      }
    } catch (error) {
      console.error("Could not fetch vendor menu. Please try again.");
    } finally {
      setMenuLoading(false);
    }
  };

  const getVendor = async (username) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[username][$eq]=${username}&populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.data.length > 0) {
        setVendorData(data.data[0]);
        getVendorMenu(data.data[0].documentId);
      }
    } catch (error) {
      console.error("Could not verify your vendor status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="md:w-[80%] w-[90%] mx-auto">
      <section className="relative">
        {vendorData?.coverImage?.url && (
          <Image
            src={vendorData.coverImage.url}
            alt="cover Image"
            className="w-full h-auto aspect-4/1 object-cover rounded-lg"
            width={1200}
            height={300}
            priority
          />
        )}
        {vendorData?.avatar?.url && (
          <Image
            src={vendorData.avatar.url}
            alt="Profile"
            className="md:w-48 md:h-48 w-24 h-24 rounded-full object-cover relative md:bottom-16 bottom-8 left-5 border-white border-8"
            width={192}
            height={192}
            priority
          />
        )}
        <div className="lg:mb-0 lg:absolute lg:bottom-0 lg:right-0 lg:w-[75%] xl:w-[80%] pl-4 -mt-6 lg:mt-0">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
            {vendorData?.storeName?.replace(/\b\w/g, (c) => c.toUpperCase())}
            {vendorData.isVerified ? (
              <span className="flex items-center gap-1 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                <BadgeCheck size={14} /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                <BadgeCheck size={14} /> New Chef
              </span>
            )}
          </h2>
          <span className="block text-sm hover:underline text-gray-500">
            @{username}
          </span>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {vendorData?.bio ||
              "Welcome to our store! We take pride in offering high-quality products and exceptional service to our valued customers. Browse through our menu discover our delicious."}
          </p>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed bg-slate-50 px-4 rounded-full w-fit">
            {vendorData?.businessAddress}, {vendorData?.city}
          </p>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm">
              <FaStar className="text-yellow-400" />
              <span className="text-gray-800 font-semibold ml-1">
                {vendorData?.rating || 0}
              </span>
            </div>
            <div className="flex items-center bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium gap-1">
              <FaMapMarkerAlt size={14} />
              {vendorData?.city}, {vendorData?.zipcode}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="relative my-8 flex items-center justify-center overflow-hidden">
          <Separator />
          <div className="px-2 text-center bg-background text-sm">MENU</div>
          <Separator />
        </div>
        {menuLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loading />
          </div>
        ) : menu?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {menu.map((dish) => (
              <ProductCard key={dish.id} dish={dish} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-500">
            <p className="text-lg font-medium">No menu available</p>
            <p className="text-sm mt-2">
              This vendor hasn&apos;t added any dishes yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Page;
