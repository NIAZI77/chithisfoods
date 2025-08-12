import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { FaStore, FaStar, FaPaypal } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { Flame, Star, X, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Spinner from "@/app/components/Spinner";
import OrderStatusBadge from "./OrderStatusBadge";
import ReviewDialog from "./ReviewDialog";
import RefundDialog from "./RefundDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const VendorOrderGroup = ({ order, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewedDishes, setReviewedDishes] = useState({});
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundEmail, setRefundEmail] = useState("");
  const [isUpdatingRefund, setIsUpdatingRefund] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);

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

      // --- Begin sales increment logic ---
      let totalQuantity = 0;
      // Increment each dish's weeklySalesCount
      for (const dish of order.dishes) {
        const dishId = dish.id;
        const quantity = dish.quantity || 1;
        totalQuantity += quantity;
        // Fetch current dish data to get the current weeklySalesCount
        const dishDataRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dishId}`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        });
        const dishData = await dishDataRes.json();
        const currentWeeklySalesCount = dishData.data.weeklySalesCount || 0;
        const updatedWeeklySalesCount = currentWeeklySalesCount + quantity;

        // Now update the dish with the new weeklySalesCount
        const dishRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dishId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
              data: {
                weeklySalesCount: updatedWeeklySalesCount,
              },
            }),
          }
        );
        if (!dishRes.ok) {
          toast.error(`Failed to update sales for dish: ${dish.name}`);
        }
      }
      // Increment vendor's weeklyItemsSold
      if (order.vendorId && totalQuantity > 0) {
        const vendorRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${order.vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
          }
        );
        const vendorData = await vendorRes.json();
        const currentWeeklyItemsSold = vendorData.data?.weeklyItemsSold || 0;

        // 2. Update with the new value
        const updatedWeeklyItemsSold = currentWeeklyItemsSold + totalQuantity;

        const updateRes = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${order.vendorId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
              data: {
                weeklyItemsSold: updatedWeeklyItemsSold,
              },
            }),
          }
        );
        if (!vendorRes.ok) {
          toast.error("Failed to update vendor's weekly sales count");
        }
      }
      // --- End sales increment logic ---

      toast.success("Order marked as received!");
      onStatusUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
    } finally {
      setIsUpdating(false);
      setIsReceiveDialogOpen(false);
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
          const dishTotalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
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

      console.log(
        `Vendor ${vendorId} rating updated to: ${averageRating.toFixed(
          2
        )} (${totalReviews} reviews)`
      );
    } catch (error) {
      console.error("Error updating vendor rating:", error);
    }
  };

  const validatePayPalEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      toast.error("Please enter your PayPal email address");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleRefundEmailSubmit = async () => {
    if (!validatePayPalEmail(refundEmail)) {
      return;
    }

    setIsUpdatingRefund(true);
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
              refundEmail: refundEmail,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update PayPal email");
      }

      toast.success("PayPal email updated successfully!");
      setIsRefundDialogOpen(false);
      onStatusUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to update PayPal email");
    } finally {
      setIsUpdatingRefund(false);
    }
  };

  const handleRemoveRefundEmail = async () => {
    setIsUpdatingRefund(true);
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
              refundEmail: null,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove refund email");
      }

      toast.success("Refund email removed successfully!");
      onStatusUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to remove refund email");
    } finally {
      setIsUpdatingRefund(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
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
              orderStatus: "cancelled",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel order");
      }

      toast.success("Order cancelled successfully!");
      onStatusUpdate();
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
      setIsCancelDialogOpen(false);
    }
  };

  const openCancelDialog = () => {
    setIsCancelDialogOpen(true);
  };

  const openReceiveDialog = () => {
    setIsReceiveDialogOpen(true);
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
            {order.paymentStatus === "refunded" && (
              <p className="text-sm text-gray-500 font-semibold">
                Refunded({order.refundEmail})
              </p>
            )}
            <OrderStatusBadge status={order.orderStatus} />

            {order.orderStatus === "pending" && (
              <button
                onClick={openCancelDialog}
                disabled={isCancelling}
                className="px-4 py-1.5 text-sm bg-rose-500 text-white rounded-md transition-colors hover:bg-rose-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCancelling ? <Spinner /> : "Cancel Order"}
              </button>
            )}

            {order.orderStatus === "ready" && (
              <button
                onClick={openReceiveDialog}
                disabled={isUpdating}
                className="px-4 py-1.5 text-sm bg-green-500 text-white rounded-md transition-colors hover:bg-green-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdating ? <Spinner /> : "Mark as Received"}
              </button>
            )}
            {(order.orderStatus === "cancelled" && order.paymentStatus !== "refunded") && (
              <div className="flex items-center gap-2">
                {order.refundEmail ? (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <FaPaypal className="w-4 h-4 text-[#0070ba]" />
                      <span className="text-sm text-gray-600">
                        PayPal: {order.refundEmail}
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveRefundEmail}
                      disabled={isUpdatingRefund}
                      className="text-gray-400 hover:text-rose-500 transition-colors p-1 hover:bg-gray-100 rounded-full"
                      title="Remove PayPal email"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setRefundEmail("");
                      setIsRefundDialogOpen(true);
                    }}
                    className="px-4 py-1.5 text-sm bg-[#0070ba] text-white rounded-md transition-colors hover:bg-[#005ea6] font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaPaypal className="w-4 h-4" />
                    Add PayPal Email
                  </button>
                )}
              </div>
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

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        selectedDish={selectedDish}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        isRating={isRating}
        onRatingSubmit={handleRatingSubmit}
      />

      <RefundDialog
        isOpen={isRefundDialogOpen}
        onOpenChange={setIsRefundDialogOpen}
        refundEmail={refundEmail}
        setRefundEmail={setRefundEmail}
        isUpdatingRefund={isUpdatingRefund}
        onSubmit={handleRefundEmailSubmit}
      />

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto sm:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Cancel Order
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600 mt-2">
              Are you sure you want to cancel this order? This action cannot be reversed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <AlertDialogCancel className="mt-0 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800">
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto sm:mx-0 mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Flame className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Mark Order as Received
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-gray-600 mt-2">
              Are you sure you have received this order?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <AlertDialogCancel className="mt-0 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800">
              Not Yet
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReceived}
              className="bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
            >
              <Flame className="h-4 w-4" />
              Mark as Received
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VendorOrderGroup; 