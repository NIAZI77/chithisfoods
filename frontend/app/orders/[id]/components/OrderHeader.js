import { Package } from "lucide-react";

const OrderHeader = () => {
  return (
    <>
      <div
        className="h-64 md:h-72 relative mb-10 border-b-5 border-rose-500 -mt-28 bg-cover bg-no-repeat bg-bottom"
        style={{ backgroundImage: "url('/thankyoubg.png')" }}
      >
        <div className="absolute -bottom-6  left-[calc(50%-24px)] w-12 h-12 bg-rose-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-extrabold">
          <Package size={24} />
        </div>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
        <p className="text-gray-600 mt-2">
          Here are the details of your order.
        </p>
      </div>
    </>
  );
};

export default OrderHeader; 