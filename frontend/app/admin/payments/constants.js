export const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  delivered: "bg-green-100 text-green-700",
  default: "bg-gray-100 text-gray-800",
};

export const PAYMENT_STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  default: "bg-gray-100 text-gray-800",
};

export const BUTTON_STYLES = {
  payVendor: "w-40 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm",
  processRefund: "w-40 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm",
};

export const TIME_FILTERS = {
  "this-week": "This Week",
  "this-month": "This Month",
  "all-time": "All Time",
};

export const ACTION_STATUS_STYLES = {
  refunded: "text-red-600 font-medium flex items-center justify-center gap-2",
  paid: "text-emerald-600 font-medium flex items-center justify-center gap-2",
  default: "text-gray-500 flex items-center justify-center gap-2"
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