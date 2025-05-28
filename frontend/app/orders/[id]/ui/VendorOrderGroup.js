"use client";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next";
import { FaStore, FaShoppingBag, FaStar } from "react-icons/fa";
import { Flame } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import OrderStatusBadge from "./OrderStatusBadge";
import ReviewDialog from "./ReviewDialog";

const VendorOrderGroup = ({ order, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewedDishes, setReviewedDishes] = useState({});
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Function to check review status for a single dish
  const checkDishReviewStatus = async (dishId) => {
    try {
      const user = getCookie("user");
      if (!user) {
        return false; // Not logged in
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

      // Check if user has already reviewed this dish
      const userReview = reviews.find((review) => review.email === user);
      return !!userReview; // Return true if user has reviewed
    } catch (error) {
      console.error("Error checking review status:", error);
      return false;
    }
  };

  // Check review status for all dishes when component mounts
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

        // Update reviewedDishes state with the results
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

    // Double check if user has already reviewed
    if (reviewedDishes[selectedDish.id]) {
      toast.error("You have already reviewed this dish");
      setIsReviewDialogOpen(false);
      return;
    }

    setIsRating(true);
    try {
      // First get the current dish data
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

      // Final check if user has already reviewed
      const userReview = currentReviews.find((review) => review.email === user);
      if (userReview) {
        toast.error("You have already reviewed this dish");
        setIsReviewDialogOpen(false);
        return;
      }

      // Add new review with email
      const newReview = {
        name: order.customerName,
        email: user,
        rating: selectedRating,
        text: reviewText || "No comment provided",
      };

      // Calculate new average rating
      const newRating =
        (currentRating * currentReviewCount + selectedRating) /
        (currentReviewCount + 1);

      // Update dish with new review and rating
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

  const handleReceived = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders/${order.id}`,
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
                        className="px-4 py-1.5 text-sm bg-rose-500 text-white rounded-md transition-colors hover:bg-rose-600 font-semibold flex items-center gap-2"
                      >
                        <FaStar className="text-yellow-400" />
                        Write a Review
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
        onClose={() => setIsReviewDialogOpen(false)}
        selectedDish={selectedDish}
        onSubmit={handleRatingSubmit}
        isRating={isRating}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
      />
    </>
  );
};

export default VendorOrderGroup; 