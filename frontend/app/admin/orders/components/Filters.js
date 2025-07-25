import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Filters = ({ timeFilter, filterStatus, vendorPaymentStatus, onTimeFilterChange, onFilterStatusChange, onVendorPaymentChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-time">All Time</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Order Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-process">In Process</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={vendorPaymentStatus} onValueChange={onVendorPaymentChange}>
          <SelectTrigger className="w-[210px]">
            <SelectValue placeholder="Vendor Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendor Payments</SelectItem>
            <SelectItem value="paid">Paid to Vendor</SelectItem>
            <SelectItem value="unpaid">Unpaid to Vendor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Filters; 