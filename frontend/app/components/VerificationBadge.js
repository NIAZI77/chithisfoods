import { BadgeCheck, OctagonAlert, XCircle } from "lucide-react";
import React from "react";

const VerificationBadge = ({ status, size = "small" }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "verified":
        return {
          bg: "bg-green-600",
          text: "text-white",
          label: "Verified",
          icon: <BadgeCheck className="inline w-4 h-4" />,
        };
      case "new-chef":
        return {
          bg: "bg-gray-700",
          text: "text-white",
          label: "New Chef",
          icon: <OctagonAlert className="inline w-4 h-4" />,
        };
      case "unverified":
        return {
          bg: "bg-yellow-500",
          text: "text-white",
          label: "Unverified",
          icon: <OctagonAlert className="inline w-4 h-4" />,
        };
      case "banned":
        return {
          bg: "bg-red-600",
          text: "text-white",
          label: "Banned",
          icon: <XCircle className="inline w-4 h-4" />,
        };
      case "rejected":
        return {
          bg: "bg-orange-600",
          text: "text-white",
          label: "Rejected",
          icon: <OctagonAlert className="inline w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-white",
          label: "Unknown",
          icon: <BadgeCheck className="inline w-4 h-4" />,
        };
    }
  };

  const getSizeStyles = (size) => {
    switch (size) {
      case "small":
        return {
          text: "text-xs",
          icon: "w-3 h-3",
          padding: "py-0.5",
          width: "w-28",
        };
      case "large":
        return {
          text: "text-base",
          icon: "w-4 h-4",
          padding: "py-1",
          width: "w-32",
        };
      default:
        return {
          text: "text-sm",
          icon: "w-4 h-4",
          padding: "py-0.5",
          width: "w-32",
        };
    }
  };

  const statusStyles = getStatusStyles(status);
  const sizeStyles = getSizeStyles(size);

  return (
    <span
      className={`flex items-center justify-center gap-1 ${statusStyles.bg} ${statusStyles.text} ${sizeStyles.text} ${sizeStyles.padding} ${sizeStyles.width} rounded-full font-semibold`}
    >

      {statusStyles.icon}

      {statusStyles.label}
    </span>
  );
};

export default VerificationBadge; 