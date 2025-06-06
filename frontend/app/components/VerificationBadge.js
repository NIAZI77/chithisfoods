import { BadgeCheck, OctagonAlert, XCircle } from "lucide-react";

const VerificationBadge = ({ status, size = "default" }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "verified":
        return {
          bg: "bg-green-100",
          text: "text-green-600",
          label: "Verified",
          icon: <BadgeCheck className="w-4 h-4" />,
        };
      case "new-chef":
        return {
          bg: "bg-gray-200",
          text: "text-gray-600",
          label: "New Chef",
          icon: <OctagonAlert className="w-4 h-4" />,
        };
      case "unverified":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-600",
          label: "Unverified",
          icon: <OctagonAlert className="w-4 h-4" />,
        };
      case "banned":
        return {
          bg: "bg-red-100",
          text: "text-red-600",
          label: "Banned",
          icon: <XCircle className="w-4 h-4" />,
        };
      case "rejected":
        return {
          bg: "bg-orange-200",
          text: "text-orange-600",
          label: "Rejected",
          icon: <OctagonAlert className="w-4 h-4" />,
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Unknown",
          icon: <BadgeCheck className="w-4 h-4" />,
        };
    }
  };

  const getSizeStyles = (size) => {
    switch (size) {
      case "small":
        return {
          text: "text-2.5",
          icon: 10,
          padding: "py-0.5",
        };
      case "large":
        return {
          text: "text-sm",
          icon: 16,
          padding: "py-1",
        };
      default:
        return {
          text: "text-xs",
          icon: 14,
          padding: "py-0.5",
        };
    }
  };

  const statusStyles = getStatusStyles(status);
  const sizeStyles = getSizeStyles(size);

  return (
    <span
      className={`flex items-center justify-center gap-1 ${statusStyles.bg} ${statusStyles.text} ${sizeStyles.padding} ${sizeStyles.text} w-28 flex items-center justify-center rounded-full font-medium`}
    >
      {statusStyles.icon}
      {statusStyles.label}
    </span>
  );
};

export default VerificationBadge; 