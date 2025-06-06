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
            {(() => {
              switch (vendorData?.verificationStatus) {
                case 'verified':
                  return (
                    <span className="flex items-center gap-1 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                      <BadgeCheck size={14} /> Verified
                    </span>
                  );
                case 'new-chef':
                  return (
                    <span className="flex items-center gap-1 bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      <BadgeCheck size={14} /> New Chef
                    </span>
                  );
                case 'unverified':
                  return (
                    <span className="flex items-center gap-1 bg-yellow-100 text-yellow-600 py-0.5 px-2 rounded-full text-xs">
                      <BadgeCheck size={14} /> Unverified
                    </span>
                  );
                case 'banned':
                  return (
                    <span className="flex items-center gap-1 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                      <BadgeCheck size={14} /> Banned
                    </span>
                  );
                default:
                  return (
                    <span className="flex items-center gap-1 bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      <BadgeCheck size={14} /> New Chef
                    </span>
                  );
              }
            })()}
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

<div className="gap-2 my-8 bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
  <div className="text-sm text-rose-500 font-bold mb-3 flex items-center gap-2">
    <span className="bg-rose-50 p-1 rounded-full"><FaStar className="text-rose-500" size={12} /></span>
    Prepared by
  </div>
  <div className="flex items-center gap-5">
    <div className="relative">
      <Image
        src={vendorDetails?.avatar?.url || dishDetails.chef?.avatar?.url || "/fallback.png"}
        alt={vendorDetails?.fullName || dishDetails.chef?.name || "Chef"}
        width={64}
        height={64}
        className="rounded-full w-16 h-16 object-cover border-2 border-rose-100 shadow-sm"
      />
      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
        <FaStar className="text-yellow-400" size={14} />
      </div>
    </div>
    <div className="flex flex-col gap-1.5">
      <span className="text-lg font-semibold text-gray-800">
        {vendorDetails?.fullName || dishDetails.chef?.name}
      </span>
      {vendorDetails?.username && (
        <Link
          href={`/vendors/@${vendorDetails?.username}`}
          className="text-gray-500 text-xs hover:text-rose-500 hover:underline flex items-center gap-1"
        >
          <span className="bg-gray-100 p-1 rounded-full"><FaUser size={10} /></span>
          @{vendorDetails?.username}
        </Link>
      )}
      {(() => {
        switch (vendorDetails?.verificationStatus) {
          case 'verified':
            return (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-600 py-1 px-3 rounded-full text-xs w-fit">
                <BadgeCheck size={14} /> Verified Chef
              </span>
            );
          case 'new-chef':
            return (
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 py-1 px-3 rounded-full text-xs w-fit">
                <FaUser size={14} /> New Chef
              </span>
            );
          case 'unverified':
            return (
              <span className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 py-1 px-3 rounded-full text-xs w-fit">
                <AlertCircle size={14} /> Unverified
              </span>
            );
          case 'banned':
            return (
              <span className="flex items-center gap-1.5 bg-red-50 text-red-600 py-1 px-3 rounded-full text-xs w-fit">
                <AlertCircle size={14} /> Banned
              </span>
            );
          default:
            return (
              <span className="flex items-center gap-1.5 bg-gray-50 text-gray-600 py-1 px-3 rounded-full text-xs w-fit">
                <FaUser size={14} /> New Chef
              </span>
            );
        }
      })()}
      <div className="text-sm text-yellow-500 flex items-center gap-1.5 mt-1 bg-yellow-50 py-1 px-3 rounded-full w-fit">
        <FaStar size={14} />
        <span className="font-medium">{vendorDetails?.rating || dishDetails.chef?.rating || 0}</span>
        <span className="text-gray-500 text-xs">rating</span>
      </div>
    </div>
  </div>
</div>
