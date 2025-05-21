const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: "bg-amber-200 text-amber-900 font-bold w-24 text-center",
    "in-process": "bg-sky-200 text-sky-900 font-bold w-24 text-center",
    ready: "bg-emerald-200 text-emerald-900 font-bold w-24 text-center",
    delivered: "bg-gray-200 text-gray-900 font-bold w-24 text-center",
    cancelled: "bg-rose-200 text-rose-900 font-bold w-24 text-center",
  };
  const labelMap = {
    pending: "PENDING",
    "in-process": "IN-PROCESS",
    ready: "READY",
    delivered: "DELIVERED",
    cancelled: "CANCELLED",
  };
  return (
    <span
      className={
        "text-xs font-medium px-2 py-1 rounded-full " +
        (statusMap[status] || "")
      }
    >
      {labelMap[status] || status}
    </span>
  );
};

export default StatusBadge; 