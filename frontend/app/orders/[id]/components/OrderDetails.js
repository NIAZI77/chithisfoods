import {
  Receipt,
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
} from "lucide-react";

const OrderDetails = ({ order }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Receipt className="text-gray-500" size={20} />
        <div>
          <span className="text-gray-500">Order Number</span>
          <p className="text-black font-medium">{order.customerOrderId}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="text-gray-500" size={20} />
        <div>
          <span className="text-gray-500">Date of Order</span>
          <p className="text-black font-medium">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <User className="text-gray-500" size={20} />
        <div>
          <span className="text-gray-500">Recipient&apos;s Name</span>
          <p className="text-black font-medium">{order.customerName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin className="text-gray-500" size={20} />
        <div>
          <span className="text-gray-500">Delivery Address</span>
          <p className="text-black font-medium">{order.address}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="text-gray-500" size={20} />
        <div>
          <span className="text-gray-500">Phone Number</span>
          <p className="text-black font-medium">{order.phone}</p>
        </div>
      </div>
      {order.note.length > 0 && (
        <div className="flex items-center gap-2">
          <FileText className="text-gray-500" size={20} />
          <div>
            <span className="text-gray-500">Note</span>
            <p className="text-black font-medium">{order.note}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails; 