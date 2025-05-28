const OrderStatusBadge = ({ status }) => {
  return (
    <p
      className={`w-24 rounded-full py-1 flex items-center justify-center capitalize
        ${status === "delivered" && "bg-gray-100 text-gray-700"}
        ${status === "ready" && "bg-green-100 text-green-700"}
        ${status === "pending" && "bg-yellow-100 text-yellow-700"}
        ${status === "in-process" && "bg-indigo-100 text-indigo-700"}
        ${status === "cancelled" && "bg-red-100 text-red-700"}
        text-center text-sm font-semibold`}
    >
      {status}
    </p>
  );
};

export default OrderStatusBadge; 