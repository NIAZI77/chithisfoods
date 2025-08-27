export const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
  pending: "bg-yellow-100 text-yellow-700",
  refunded: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
  delivered: "bg-slate-100 text-slate-700",
  default: "bg-slate-100 text-slate-800",
};

export const PAYMENT_STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  default: "bg-slate-100 text-slate-800",
};

export const BUTTON_STYLES = {
  payVendor: "w-40 px-4 py-2 bg-green-600 text-white rounded-full shadow-green-300 shadow-md hover:bg-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
  processRefund: "w-40 px-4 py-2 bg-red-600 text-white rounded-full shadow-red-300 shadow-md hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
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