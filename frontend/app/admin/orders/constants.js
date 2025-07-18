export const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
  "in-process": "bg-indigo-100 text-indigo-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-800",
};

export const TIME_FILTERS = {
  "this-week": "This Week",
  "this-month": "This Month",
  "all-time": "All Time",
};

export const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #666;
  }
`; 