"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdDeliveryDining } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShoppingBag } from "react-icons/fa";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    addressLine: "",
    deliveryInstructions: "",
  });
  const [orderType, setOrderType] = useState("delivery");

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    setCartItems(JSON.parse(cart) || []);
    const subtotal = localStorage.getItem("total");
    const taxRate = localStorage.getItem("taxRate");
    setTaxRate(taxRate);
    setTotal(subtotal);
    if (!cart || cart.length === 0) {
      router.push("/");
    }
  }, [router]);
  useEffect(() => {
    const getCookie = (name) => {
      const cookieArr = document.cookie.split(";");
      for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.startsWith(name + "=")) {
          return decodeURIComponent(cookie.substring(name.length + 1));
        }
      }
      return null;
    };

    const storedJwt = getCookie("jwt");
    const storedUser = getCookie("user");
    if (!storedJwt || !storedUser) {
      router.push("/login");
    } else {
      setFormData((prev) => ({ ...prev, email: storedUser }));
    }
  }, [cartItems, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value); // Update the order type based on the radio button selection
  };

  function transformData(data) {
    const result = [];
    const vendors = {};

    data.products.forEach((product) => {
      if (!vendors[product.vendorID]) {
        vendors[product.vendorID] = [];
      }
      vendors[product.vendorID].push(product);
    });

    for (const vendorID in vendors) {
      const products = vendors[vendorID];
      result.push({ products });
    }

    return result;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const orders = transformData({
      products: cartItems,
    });
    const cOrderID = new Date().getTime();
    Promise.all(
      orders.map(async (item) => {
        const orderID = new Date().getTime();
        const productTotal = item.products.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0
        );
        const withTax = productTotal + (productTotal * taxRate) / 100;
        try {
          setSubmitting(true);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              },
              body: JSON.stringify({
                data: {
                  order_id: orderID,
                  order_status: "pending",
                  email: formData.email,
                  phone: parseInt(formData.phone),
                  address: formData.address,
                  addressLine: formData.addressLine,
                  instruction: formData.deliveryInstructions,
                  customer_name: formData.name,
                  vendor_id: item.products[0].vendorID,
                  vendor_name: item.products[0].vendor_name,
                  products: item.products,
                  cOrderID,
                  cTotal: total,
                  taxRate,
                  totalWithTax: withTax,
                  productTotal,
                  orderType,
                },
              }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("taxRate");
            setSuccess(true);
            return true;
          } else {
            setSuccess(false);
            return false;
          }
        } catch (err) {
          setSuccess(false);
          return false;
        } finally {
          setSubmitting(false);
        }
      })
    ).then((results) => {
      const allSuccess = results.every((result) => result === true);

      if (allSuccess) {
        toast.success("Order placed successfully!");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        toast.error("Failed to create order. Please try again.");
      }
    });
  };

  return (
    <>
      <div className="w-[95%] mx-auto px-4 py-8">
        <h1 className="md:text-2xl text-xl font-semibold mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Delivery Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300"
                    placeholder="+1 234 567 890"
                    required
                  />
                </div>
                {orderType == "delivery" && (
                  <div className="space-y-6">
                    <div>
                      <label
                        className="block text-sm font-medium"
                        htmlFor="address"
                      >
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300"
                        placeholder="123 Main St"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium"
                        htmlFor="addressLine"
                      >
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        id="addressLine"
                        name="addressLine"
                        value={formData.addressLine}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300"
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium"
                        htmlFor="deliveryInstructions"
                      >
                        Delivery Instructions
                      </label>
                      <textarea
                        id="deliveryInstructions"
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300"
                        placeholder="Leave at the front door."
                      />
                    </div>
                  </div>
                )}

                {/* Order Type Selection */}
                <div className="mt-4 font-bold">
                  <label className="block text-sm font-medium">
                    Order Type
                  </label>
                  <div className="flex space-x-4">
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        id="delivery"
                        name="orderType"
                        value="delivery"
                        checked={orderType === "delivery"}
                        onChange={handleOrderTypeChange}
                      />
                      <label htmlFor="delivery" className="ml-2 flex items-center justify-center">
                        <MdDeliveryDining className="inline mr-2" /> Delivery
                      </label>
                    </div>
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        id="pickup"
                        name="orderType"
                        value="pickup"
                        checked={orderType === "pickup"}
                        onChange={handleOrderTypeChange}
                      />
                      <label htmlFor="pickup" className="ml-2 flex items-center justify-center">
                        <FaShoppingBag className="inline mr-2" /> Pickup
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-orange-500 text-white text-lg font-semibold mt-4 hover:bg-orange-600 transition-colors rounded-full"
                    disabled={submitting}
                  >
                    {submitting ? "Order Placing..." : "Place Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white p-6">
            <div>
              <h1 className="font-semibold text-2xl border-b pb-8">
                Order Summary
              </h1>
              <div className="flex justify-between mt-10 mb-5">
                <span className="font-semibold text-sm uppercase">Items</span>
                <span className="font-semibold text-sm">
                  {cartItems.length}
                </span>
              </div>
              <div className="border-t mt-8">
                <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                  <span>Total cost</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}
