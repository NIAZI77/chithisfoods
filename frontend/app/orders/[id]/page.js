"use client";
import Loading from "@/app/loading";
import { getCookie } from "cookies-next";
import {
  Flame,
  Package,
  Receipt,
  Calendar,
  User,
  MapPin,
  Phone,
  FileText,
  Truck,
  Star,
  MessageSquare,
  X,
  Clock,
} from "lucide-react";
import { FaShoppingBag, FaStore, FaStar } from "react-icons/fa";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { LuSquareSigma } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Spinner from "@/app/components/Spinner";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPrimitive,
  DialogTitle,
} from "./components/dialog";

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

const VendorOrderGroup = ({ order, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewedDishes, setReviewedDishes] = useState({});
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isCheckingReview, setIsCheckingReview] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const handleReceived = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${order.documentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              orderStatus: "delivered",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success("Order marked as received!");
      onStatusUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const checkDishReviewStatus = async (dishId) => {
    try {
      const user = getCookie("user");
      if (!user) {
        return false;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dishId}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dish data");
      }

      const dishData = await response.json();
      const reviews = dishData.data.reviews || [];

      const userReview = reviews.find((review) => review.email === user);
      return !!userReview;
    } catch (error) {
      console.error("Error checking review status:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAllDishesReviewStatus = async () => {
      setIsLoadingReviews(true);
      try {
        const reviewStatuses = await Promise.all(
          order.dishes.map(async (dish) => {
            const hasReviewed = await checkDishReviewStatus(dish.id);
            return { dishId: dish.id, hasReviewed };
          })
        );

        const reviewedStatus = reviewStatuses.reduce(
          (acc, { dishId, hasReviewed }) => {
            acc[dishId] = hasReviewed;
            return acc;
          },
          {}
        );

        setReviewedDishes(reviewedStatus);
      } catch (error) {
        console.error("Error checking reviews:", error);
        toast.error("Failed to load review status");
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (order.dishes.length > 0) {
      checkAllDishesReviewStatus();
    }
  }, [order.dishes]);

  const handleReviewClick = async (dish) => {
    const user = getCookie("user");
    if (!user) {
      toast.error("Please login to review");
      return;
    }

    if (reviewedDishes[dish.id]) {
      toast.info("You have already reviewed this dish");
      return;
    }

    setSelectedDish(dish);
    setSelectedRating(0);
    setReviewText("");
    setIsReviewDialogOpen(true);
  };

  const handleRatingSubmit = async () => {
    if (!selectedDish) return;

    if (selectedRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const user = getCookie("user");
    if (!user) {
      toast.error("Please login to review");
      return;
    }

    if (reviewedDishes[selectedDish.id]) {
      toast.error("You have already reviewed this dish");
      setIsReviewDialogOpen(false);
      return;
    }

    setIsRating(true);
    try {
      const dishResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${selectedDish.id}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!dishResponse.ok) {
        throw new Error("Failed to fetch dish data");
      }

      const dishData = await dishResponse.json();
      const currentReviews = dishData.data.reviews || [];
      const currentRating = dishData.data.rating || 0;
      const currentReviewCount = currentReviews.length;

      const userReview = currentReviews.find((review) => review.email === user);
      if (userReview) {
        toast.error("You have already reviewed this dish");
        setIsReviewDialogOpen(false);
        return;
      }

      const newReview = {
        name: order.customerName,
        email: user,
        rating: selectedRating,
        text: reviewText || "No comment provided",
      };

      const newRating =
        (currentRating * currentReviewCount + selectedRating) /
        (currentReviewCount + 1);

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${selectedDish.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              reviews: [...currentReviews, newReview],
              rating: newRating,
            },
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update dish review");
      }

      await updateVendorRating(selectedDish.id);

      toast.success(`Thank you for rating ${selectedDish.name}!`);
      setReviewedDishes((prev) => ({ ...prev, [selectedDish.id]: true }));
      setIsReviewDialogOpen(false);
      setSelectedDish(null);
      setSelectedRating(0);
      setReviewText("");
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsRating(false);
    }
  };

  const updateVendorRating = async (dishId) => {
    try {
      const dishResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dishId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!dishResponse.ok) {
        throw new Error("Failed to fetch dish data");
      }

      const dishData = await dishResponse.json();
      const vendorId = dishData.data.vendorId;

      if (!vendorId) {
        console.warn("No vendorId found for dish:", dishId);
        return;
      }

      const vendorDishesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes?filters[vendorId][$eq]=${vendorId}&fields[0]=reviews`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!vendorDishesResponse.ok) {
        throw new Error("Failed to fetch vendor dishes");
      }

      const vendorDishesData = await vendorDishesResponse.json();
      const vendorDishes = vendorDishesData.data || [];

      let totalRating = 0;
      let totalReviews = 0;

      vendorDishes.forEach((dish) => {
        const reviews = dish.reviews || [];
        if (reviews.length > 0) {
          const dishTotalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          totalRating += dishTotalRating;
          totalReviews += reviews.length;
        }
      });

      const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

      const vendorUpdateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              rating: averageRating,
            },
          }),
        }
      );

      if (!vendorUpdateResponse.ok) {
        throw new Error("Failed to update vendor rating");
      }

      console.log(`Vendor ${vendorId} rating updated to: ${averageRating.toFixed(2)} (${totalReviews} reviews)`);
    } catch (error) {
      console.error("Error updating vendor rating:", error);
    }
  };

  const renderRatingStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={() => interactive && setSelectedRating(index + 1)}
        className={`${interactive ? "cursor-pointer" : ""}`}
        disabled={!interactive || isRating}
      >
        <FaStar
          className={`w-5 h-5 ${
            index < rating ? "text-yellow-400" : "text-gray-300"
          } ${interactive ? "hover:text-yellow-400" : ""}`}
        />
      </button>
    ));
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <FaStore className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              @{order.vendorUsername}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.orderStatus} />
            {order.orderStatus === "ready" && (
              <button
                onClick={handleReceived}
                disabled={isUpdating}
                className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-md transition-colors hover:bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating ? <Spinner /> : "Mark as Received"}
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {order.dishes.map((dish, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="relative h-10 w-16 aspect-auto flex-shrink-0">
                <Image
                  fill
                  src={dish.image?.url}
                  alt={dish.name}
                  className="object-cover rounded-md h-20 w-fit aspect-auto"
                />
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <h4 className="font-medium text-gray-800 capitalize text-base sm:text-lg">
                    {dish.name}
                  </h4>
                  <p className="text-rose-600 font-semibold text-base sm:text-lg">
                    ${dish.total}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <FaShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" /> Qty:{" "}
                    {dish.quantity}
                  </span>
                  {dish.selectedSpiciness && (
                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 sm:w-4 sm:h-4" />{" "}
                      {dish.selectedSpiciness}
                    </span>
                  )}
                </div>
                {(dish.toppings?.length > 0 || dish.extras?.length > 0) && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {dish.toppings?.map((topping, idx) => (
                      <span
                        key={idx}
                        className="bg-pink-100 px-2 py-0.5 rounded-full text-pink-700 text-xs sm:text-sm flex items-center gap-1"
                      >
                        <Image
                          src={"/toppings.png"}
                          alt="Topping"
                          width={12}
                          height={12}
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        {topping.name} (${topping.price})
                      </span>
                    ))}
                    {dish.extras?.map((extra, idx) => (
                      <span
                        key={idx}
                        className="bg-emerald-100 px-2 py-0.5 rounded-full text-emerald-700 text-xs sm:text-sm flex items-center gap-1"
                      >
                        <Image
                          src={"/extras.png"}
                          alt="Extra"
                          width={12}
                          height={12}
                          className="w-3 h-3 sm:w-4 sm:h-4"
                        />
                        {extra.name} (${extra.price})
                      </span>
                    ))}
                  </div>
                )}
                {order.orderStatus === "delivered" && (
                  <div className="mt-3 border-t pt-3">
                    {isLoadingReviews ? (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Spinner />
                        <span className="text-sm">
                          Checking review status...
                        </span>
                      </div>
                    ) : reviewedDishes[dish.id] ? (
                      <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                        <FaStar className="text-yellow-400" />
                        Thank you for your review!
                      </p>
                    ) : (
                      <button
                        onClick={() => handleReviewClick(dish)}
                        className="text-rose-500 hover:text-rose-600 font-bold flex items-center"
                      >
                        <Star className="w-5 h-5 mr-1" />
                        <div className="mt-0.5">Write a Review</div>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[85%] md:w-[600px] max-h-[90vh] overflow-y-auto bg-white mx-auto">
          <DialogHeader className="space-y-2 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 flex items-center gap-2 sm:gap-2.5">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                Review Dish
              </DialogTitle>
              <DialogPrimitive.Close className="rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors">
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </DialogPrimitive.Close>
            </div>
            <p className="text-sm sm:text-base text-gray-500">
              Share your experience with {selectedDish?.name}
            </p>
          </DialogHeader>

          <div className="p-4 space-x-2 space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                Your Rating
              </label>
              <div className="flex gap-1 sm:gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl items-center justify-center">
                {renderRatingStars(selectedRating, true)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm sm:text-base font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                Your Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Tell us about your experience with this dish..."
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg sm:rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 bg-gray-50 h-[80px] sm:h-[100px] placeholder:text-gray-400"
                rows={3}
                disabled={isRating}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 pt-2 sticky bottom-0 bg-white border-t">
            <button
              onClick={() => setIsReviewDialogOpen(false)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base text-gray-600 hover:text-gray-800 font-medium rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors"
              disabled={isRating}
            >
              Cancel
            </button>
            <button
              onClick={handleRatingSubmit}
              disabled={isRating || selectedRating === 0}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-rose-500 text-white rounded-lg sm:rounded-xl transition-colors hover:bg-rose-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-2.5"
            >
              {isRating ? (
                <Spinner />
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  Submit Review
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default function OrderPage() {
  const { id: orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders?filters[customerOrderId][$eq]=${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to fetch order");
      }

      const { data } = await response.json();
      setOrderData(data);
    } catch (error) {
      setErrorMessage(
        error.message || "Failed to fetch order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderData?.length > 0) {
      const currentUser = getCookie("user");
      if (orderData[0].user !== currentUser) {
        setIsUnauthorized(true);
      }
    }
  }, [orderData]);

  const handleStatusUpdate = () => {
    fetchOrderDetails(orderId);
  };

  if (isLoading) return <Loading />;

  if (isUnauthorized) {
    return (
      <div className="text-center mt-10">
        <p className="text-rose-500">
          You are not authorized to view this order.
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="text-center mt-10">
        <p className="text-rose-500">{errorMessage}</p>
      </div>
    );
  }

  if (!orderData?.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const orderSubtotal = orderData.reduce(
    (sum, order) => sum + order.subtotal,
    0
  );
  const totalDeliveryFee = orderData.reduce(
    (sum, order) => sum + (Number(order.vendorDeliveryFee) || 0),
    0
  );
  const currentOrder = orderData[0];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 md:px-12 px-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Receipt className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Order Number</span>
              <p className="text-black font-medium">
                {currentOrder.customerOrderId}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Date of Order</span>
              <p className="text-black font-medium">
                {new Date(currentOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {currentOrder.deliveryDate && (
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" size={20} />
              <div>
                <span className="text-gray-500">Delivery Date</span>
                <p className="text-black font-medium">
                  {new Date(currentOrder.deliveryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
          {currentOrder.deliveryTime && (
            <div className="flex items-center gap-2">
              <Clock className="text-gray-500" size={20} />
              <div>
                <span className="text-gray-500">Delivery Time</span>
                <p className="text-black font-medium">
                  {new Date(`2000-01-01T${currentOrder.deliveryTime}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <User className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Recipient&apos;s Name</span>
              <p className="text-black font-medium">
                {currentOrder.customerName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Delivery Address</span>
              <p className="text-black font-medium">{currentOrder.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-gray-500" size={20} />
            <div>
              <span className="text-gray-500">Phone Number</span>
              <p className="text-black font-medium">{currentOrder.phone}</p>
            </div>
          </div>
          {currentOrder.note && currentOrder.note.length > 0 && (
            <div className="flex items-center gap-2">
              <FileText className="text-gray-500" size={20} />
              <div>
                <span className="text-gray-500">Note</span>
                <p className="text-black font-medium">{currentOrder.note}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow h-fit">
          <div className="flex justify-between py-2">
            <div className="flex items-center gap-2">
              <FaShoppingBag className="text-gray-500" size={20} />
              <span>Sub Total</span>
            </div>
            <span className="font-semibold">${orderSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <div className="flex items-center gap-2">
              <HiOutlineReceiptTax className="text-gray-500" size={20} />
              <span>Tax</span>
            </div>
            <span className="font-semibold">
              ${currentOrder.totalTax.toFixed(2)}
            </span>
          </div>
          {orderData.some(
            (order) => order.vendorDeliveryFee && order.vendorUsername
          ) && (
            <div className="mb-2">
              {orderData.map((order, idx) =>
                order.vendorDeliveryFee && order.vendorUsername ? (
                  <div
                    key={order.vendorId || idx}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4" />
                      {order.vendorUsername}
                    </span>
                    <span>${Number(order.vendorDeliveryFee).toFixed(2)}</span>
                  </div>
                ) : null
              )}
            </div>
          )}
          <div className="flex justify-between py-2">
            <div className="flex items-center gap-2">
              <Truck className="text-gray-500" size={20} />
              <span>Delivery</span>
            </div>
            <span className="font-semibold">
              ${totalDeliveryFee.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between border-t mt-2 pt-3 text-lg font-bold">
            <div className="flex items-center gap-2">
              <LuSquareSigma className="text-gray-500" size={20} />
              <span>Total</span>
            </div>
            <span>${currentOrder.orderTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 px-4 sm:px-6 md:px-12">
        <h2 className="text-gray-600 mb-4 text-lg font-bold flex items-center gap-2">
          <FaShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          Order Details by Vendor
        </h2>
        <div className="space-y-4 sm:space-y-6">
          {orderData.map((order) => (
            <VendorOrderGroup
              key={order.id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      </div>
    </>
  );
}
