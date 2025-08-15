"use client";

import Image from "next/image";
import { Star, Plus } from "lucide-react";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import Loading from "../loading";
import DishDetailsModal from "./DishDetailsModal";

export default function DishCard({ dish }) {
  const [vendorData, setVendorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${dish.vendorId}?populate=*`,
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
          setVendorData(data.data);
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (dish.vendorId) {
      fetchVendorData();
    }
  }, [dish.vendorId]);
if(loading) return <Loading />;
  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-md p-4 w-72 block relative cursor-pointer`}
        onClick={() => setShowModal(true)}
      >
        {!dish.available && (
          <div className="absolute top-16 right-6 bg-red-500 text-white text-xs font-semibold px-3 py-0.5 rounded-full flex items-center gap-1 shadow z-50">
            Unavailable
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image
              src={vendorData?.avatar?.url || "/fallback.png"}
              alt={vendorData?.storeName || "Vendor"}
              width={32}
              height={32}
              className="rounded-full w-8 h-8 object-cover object-center"
            />
            <div>
              <p className="font-semibold text-sm">
                {vendorData?.storeName || "Vendor"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-semibold">
            <Star className="w-4 h-4 fill-yellow-500" />
            <span>{dish.rating}</span>
          </div>
        </div>

        {/* Image */}
        <div className="rounded-xl overflow-hidden mb-3">
          <Image
            src={dish.image.url}
            alt={dish.name}
            width={268}
            height={144}
            className="w-64 h-36 aspect-video object-cover object-center rounded-xl mx-auto"
          />
        </div>

        {/* Title and Serving */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold capitalize truncate">
            {dish.name.replace("-", " ")}
          </h3>
          <div className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-sm flex items-center gap-1 justify-center">
            Servings <FaUser /> {dish.servings}
          </div>
        </div>

        {/* Category and Subcategory */}
        <p className="text-xs text-gray-500 capitalize">
          {dish.category.replaceAll("-", " ")} ·{" "}
          <span className="text-green-500 font-medium text-sm capitalize truncate">
            {dish.subcategory.replaceAll("-", " ")}
          </span>
        </p>

        {/* Add to Cart Section */}
        <div className="mt-4 grid grid-cols-3 border border-red-500 rounded-xl px-3 py-2">
          <div className="flex items-center gap-1 text-red-500 font-semibold text-xs col-span-2">
            <Plus className="uppercase w-6 h-6 p-1 bg-rose-600 text-white font-bold rounded-full" />
            Add Customization
          </div>
          <div className="text-red-500 font-bold text-md text-right border-l-2 border-l-rose-500 ml-1.5">
            ${dish.price.toFixed(2)}
          </div>
        </div>
      </div>
      <DishDetailsModal isOpen={showModal} onClose={() => setShowModal(false)} dishId={dish.documentId} />
    </>
  );
}
