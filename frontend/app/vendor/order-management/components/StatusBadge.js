const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: "bg-yellow-200 text-yellow-900 font-bold w-24 text-center",
    "in-process": "bg-indigo-200 text-indigo-900 font-bold w-24 text-center",
    ready: "bg-green-200 text-green-900 font-bold w-24 text-center",
    delivered: "bg-slate-200 text-slate-900 font-bold w-24 text-center",
    cancelled: "bg-red-200 text-red-900 font-bold w-24 text-center",
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