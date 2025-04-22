import Image from "next/image";

export default function ThankYouPage() {
  return (
    <>
      {/* Header */}
      <div className="bg-green-100 h-44 relative mb-10 border-b-5 border-rose-500"
      style={{backgroundImage: "url('/thankyoubg.png')"}}>
        <div className="absolute -bottom-6  left-[calc(50%-24px)] w-12 h-12 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-extrabold">
          ✓
        </div>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mt-2">
          Your order has been successfully placed.
        </p>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:px-12 px-4">
        <div className="space-y-3">
          <div>
            <span className="text-gray-500">Order Number</span>
            <p className="text-black font-medium">11234</p>
          </div>
          <div>
            <span className="text-gray-500">Date of Order</span>
            <p className="text-black font-medium">November 18, 2024</p>
          </div>
          <div>
            <span className="text-gray-500">Recipient&apos;s Name</span>
            <p className="text-black font-medium">John Smith</p>
          </div>
          <div>
            <span className="text-gray-500">Delivery Address</span>
            <p className="text-black font-medium">
              822 E. 20th Street, Los Angeles, CA 90011
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <div className="flex justify-between py-2">
            <span>Sub Total</span>
            <span className="font-semibold">$39.98</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax</span>
            <span className="font-semibold">$0.00</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Delivery Charges</span>
            <span className="font-semibold">$5.00</span>
          </div>
          <div className="flex justify-between border-t mt-2 pt-3 text-lg font-bold">
            <span>Total</span>
            <span>$44.98</span>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mt-10 md:px-12 px-4">
        <h2 className="text-gray-600 mb-4 text-lg font-bold">Items</h2>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-6">
          {/* Item 1 */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <Image
              width={100}
              height={100}
              src="/food.png"
              alt="Sausage Pasta"
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="font-medium text-gray-800">Sausage Pasta</p>
              <p className="text-red-600 font-bold">$19.99</p>
              <p className="text-sm text-gray-500">Qty: 1</p>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <Image
              width={100}
              height={100}
              src="/food.png"
              alt="Chow Mein"
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <p className="font-medium text-gray-800">Chow Mein</p>
              <p className="text-red-600 font-bold">$19.99</p>
              <p className="text-sm text-gray-500">Qty: 1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
