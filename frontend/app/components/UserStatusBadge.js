import { UserCheck, UserX } from "lucide-react";

const UserStatusBadge = ({ isBlocked, size = "default" }) => {
  const getStatusStyles = (isBlocked) => {
    if (isBlocked) {
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        label: "Blocked",
        icon: <UserX className="w-4 h-4" />,
      };
    } else {
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        label: "Active",
        icon: <UserCheck className="w-4 h-4" />,
      };
    }
  };

  const getSizeStyles = (size) => {
    switch (size) {
      case "small":
        return {
          text: "text-xs",
          icon: "w-3 h-3",
          padding: "px-2 py-1",
          gap: "gap-1",
        };
      case "large":
        return {
          text: "text-sm",
          icon: "w-5 h-5",
          padding: "px-3 py-2",
          gap: "gap-2",
        };
      default:
        return {
          text: "text-xs",
          icon: "w-4 h-4",
          padding: "px-2.5 py-1.5",
          gap: "gap-1.5",
        };
    }
  };

  const statusStyles = getStatusStyles(isBlocked);
  const sizeStyles = getSizeStyles(size);

  return (
    <span
      className={`inline-flex items-center ${sizeStyles.gap} ${sizeStyles.padding} ${sizeStyles.text} font-medium rounded-full border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border} shadow-sm`}
    >
      <span className={sizeStyles.icon}>{statusStyles.icon}</span>
      {statusStyles.label}
    </span>
  );
};

export default UserStatusBadge;
