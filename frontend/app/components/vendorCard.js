import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

const VendorCard = ({ vendor }) => {
  const capitalizeWords = (text) =>
    text?.replace(/\b\w/g, (char) => char.toUpperCase()) || "Unknown";

  return (
    <Link
      title={process.env.NEXT_PUBLIC_NAME}
      href={`/vendors/${vendor?.documentId}`}
      passHref
    >
      <div className="max-w-72 w-72 h-72 overflow-hidden bg-slate-50 rounded-md p-4 relative shadow-md transition hover:shadow-lg">
        {vendor?.isTopRated && (
          <div className="w-32 h-6 bg-pink-600 px-3 font-bold text-white text-sm flex items-center absolute top-4 left-4 rounded-r-md">
            Top Rated
          </div>
        )}

        <div className="mb-4">
          <Image
            src={vendor?.coverImage?.url || "/fallback.png"}
            alt={`${vendor?.name || "Vendor"} Cover`}
            width={288} // Matches w-72
            height={128} // Approx. aspect ratio for h-32
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <Image
            src={vendor?.logo?.url || "/fallback-logo.png"}
            alt={`${vendor?.name || "Vendor"} Logo`}
            width={50}
            height={50}
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <h2 className="text-lg font-bold select-text">
              {capitalizeWords(vendor?.name)}
            </h2>
            <p className="text-sm text-gray-500">
              {capitalizeWords(vendor?.location?.city)},{" "}
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
