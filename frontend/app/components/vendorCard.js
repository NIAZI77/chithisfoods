import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaStar } from "react-icons/fa";

const VendorCard = ({ vendor }) => {
  const [coverImage, setCoverImage] = useState(
    vendor?.coverImage?.url || "/fallback.png"
  );
  const [logoImg, setLogoImg] = useState(
    vendor?.logo?.url || "/fallback-logo.png"
  );

  const capitalizeWords = (text) =>
    text?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";

  return (
    <Link
      title={vendor.name || process.env.NEXT_PUBLIC_NAME}
      href={`/vendors/${vendor?.documentId}`}
    >
      <div className="max-w-72 w-72 h-64 overflow-hidden bg-slate-50 rounded-md p-4 relative shadow-md transition hover:shadow-lg">
        {vendor?.isTopRated && (
          <div
            className="w-32 h-6 bg-pink-600 px-3 font-bold text-white text-sm flex items-center absolute top-5 left-5 rounded-r-md"
            style={{
              clipPath: "polygon(100% 0, 80% 50%, 100% 100%, 0 100%, 0 0)",
            }}
          >
            Top Rated
          </div>
        )}

        <div className="mb-4">
          <Image
            src={coverImage}
            alt={`${vendor?.name || "Vendor"} Cover Image`}
            width={300}
            height={100}
            className="w-full h-28 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              setCoverImage("/fallback.png");
            }}
          />
        </div>

        <div className="flex items-center">
          <Image
            src={logoImg}
            alt={`${vendor?.name || "Vendor"} Logo`}
            width={50}
            height={50}
            className="w-14 h-14 rounded-full object-cover mr-4"
            onError={(e) => {
              e.currentTarget.onerror = null;
              setLogoImg("/fallback-logo.png");
            }}
          />
          <div>
            <h2 className="text-lg font-bold select-text">
              {capitalizeWords(vendor?.name)}
            </h2>
            <p className="text-sm text-gray-500">
              {capitalizeWords(vendor?.location?.city)} ·{" "}
              {capitalizeWords(vendor?.location?.state)}
              <br />
              {capitalizeWords(vendor?.location?.country)}
            </p>
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-400" />
              <p className="text-yellow-500 font-semibold">
                {vendor?.rating || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VendorCard;
