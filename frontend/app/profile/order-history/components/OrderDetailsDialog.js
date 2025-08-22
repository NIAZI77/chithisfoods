"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomerDetails from "./CustomerDetails";
import OrderItems from "./OrderItems";
import OrderActions from "./OrderActions";
import ReviewDialog from "./ReviewDialog";
import { TOAST_MESSAGES } from "./constants";
import { Package } from "lucide-react";
import { getCookie } from "cookies-next";

function OrderDetailsDialog({ 
  order, 
  userData, 
  isOpen, 
  onClose, 
  onStatusUpdate, 
  getCurrentUserId, 
  hasUserReviewedDish,
  validateReviewData,
  getDishReviewStatus
}) {
  const [loadingStates, setLoadingStates] = useState({
    received: false,
    cancel: false,
    review: false,
  });

  // Review system state
  const [selectedDish, setSelectedDish] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  useEffect(() => {
    if (order) {
      // Component initialization logic can go here if needed
    }
  }, [order]);

  if (!order) {
    console.log("OrderDetailsDialog - No order provided");
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-4">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Order Selected
          </h3>
          <p className="text-gray-500 text-sm">
            Please select an order to view its details.
          </p>
        </div>
      </div>
    );
  }

  // Check if order has dishes or items
  const hasDishes = order.dishes && Array.isArray(order.dishes) && order.dishes.length > 0;
  const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
  
  if (!hasDishes && !hasItems) {
    console.log("OrderDetailsDialog - Order data:", order);
    console.log("OrderDetailsDialog - Order dishes:", order.dishes);
    console.log("OrderDetailsDialog - Order items:", order.items);
    console.log("OrderDetailsDialog - Has dishes:", hasDishes);
    console.log("OrderDetailsDialog - Has items:", hasItems);
    
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-4">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Items Missing
          </h3>
          <p className="text-gray-500 text-sm">
            This order doesn&apos;t have any items or dishes associated with it.
          </p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Order ID: {order.documentId || 'Unknown'}</p>
            <p>Order Status: {order.orderStatus || 'Unknown'}</p>
            <p>Has dishes: {hasDishes ? 'Yes' : 'No'}</p>
            <p>Has items: {hasItems ? 'Yes' : 'No'}</p>
            <p>Dishes count: {order.dishes ? order.dishes.length : 'undefined'}</p>
            <p>Items count: {order.items ? order.items.length : 'undefined'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Use items if dishes is not available (for backward compatibility)
  const orderItems = order.dishes || order.items || [];

  const updateWeeklySalesCount = async () => {
    if (!orderItems || orderItems.length === 0) {
      console.log("No dishes to update weekly sales count for");
      return;
    }

    try {
      // Update weekly sales count for each dish in the order
      const updatePromises = orderItems.map(async (dish) => {
        if (!dish.id) {
          console.warn("Dish missing ID, skipping weekly sales update:", dish);
          return;
        }

        try {
          // First, fetch the current dish data to get the current weeklySalesCount
          const fetchResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dish.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              },
            }
          );

          if (!fetchResponse.ok) {
            throw new Error(`Failed to fetch dish with documentId: ${dish.id}`);
          }

          const dishData = await fetchResponse.json();
          
          if (!dishData.data || dishData.data.length === 0) {
            console.warn(`No dish found with documentId: ${dish.id}`);
            return;
          }

          const currentDish = dishData.data[0];
          const currentWeeklySalesCount = currentDish?.weeklySalesCount || 0;
          const newWeeklySalesCount = currentWeeklySalesCount + 1;

          // Update the dish with the new weekly sales count
          const updateResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${dish.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              },
              body: JSON.stringify({
                data: {
                  weeklySalesCount: newWeeklySalesCount,
                },
              }),
            }
          );

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error(`Failed to update weekly sales count for dish ${dish.id}:`, errorText);
            throw new Error(`Failed to update weekly sales count for ${dish.name}`);
          }

          console.log(`Successfully updated weekly sales count for dish: ${dish.name} (${currentWeeklySalesCount} → ${newWeeklySalesCount})`);
          return updateResponse.json();
        } catch (dishError) {
          console.error(`Error updating dish ${dish.id}:`, dishError);
          // Continue with other dishes even if one fails
          return null;
        }
      });

      // Wait for all dish updates to complete
      const results = await Promise.all(updatePromises);
      const successfulUpdates = results.filter(result => result !== null).length;
      const totalDishes = orderItems.length;
      
      console.log(`Successfully updated weekly sales count for ${successfulUpdates}/${totalDishes} dishes in the order`);
      
      if (successfulUpdates < totalDishes) {
        toast.warning(`Order marked as received, but ${totalDishes - successfulUpdates} dish sales counts could not be updated.`);
      }
    } catch (error) {
      console.error("Error updating weekly sales count:", error);
      // Don't throw error here as it shouldn't prevent the order from being marked as received
      toast.warning("Order marked as received, but there was an issue updating dish sales counts.");
    }
  };

  const handleMarkAsReceived = async () => {
    if (order.orderStatus !== "ready") {
      toast.error(TOAST_MESSAGES.RECEIVE_NOT_ALLOWED);
      return;
    }

    if (!order.documentId) {
      console.error("handleMarkAsReceived: order.documentId is missing:", order);
      toast.error("Order ID is missing. Please try refreshing the page.");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, received: true }));

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
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(TOAST_MESSAGES.ORDER_UPDATE_ERROR);
      }
      updateWeeklySalesCount();
      toast.success(TOAST_MESSAGES.ORDER_UPDATE_SUCCESS);
      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error("Error marking order as received:", error);
      toast.error(error.message || TOAST_MESSAGES.ORDER_UPDATE_ERROR);
    } finally {
      setLoadingStates((prev) => ({ ...prev, received: false }));
    }
  };

  const handleCancelOrder = async () => {
    if (order.orderStatus !== "pending") {
      toast.error(TOAST_MESSAGES.CANCEL_NOT_ALLOWED);
      return;
    }

    // Check if user has refund details
    if (!userData?.refundDetails?.provider || !userData?.refundDetails?.accountId) {
      toast.error(TOAST_MESSAGES.REFUND_DETAILS_MISSING);
      return;
    }

    if (!order.documentId) {
      console.error("handleCancelOrder: order.documentId is missing:", order);
      toast.error("Order ID is missing. Please try refreshing the page.");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, cancel: true }));

    try {
      const userEmail = userData.email || getCookie("user");

      if (!userEmail) {
        toast.error("Unable to retrieve user email. Please try refreshing the page.");
        return;
      }

      const orderRefundDetails = {
        ...userData.refundDetails,
        email: userEmail, 
        updatedAt: new Date().toISOString()
      };



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
              refundDetails: orderRefundDetails,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(TOAST_MESSAGES.ORDER_UPDATE_ERROR);
      }

      toast.success(TOAST_MESSAGES.CANCELLATION_SUCCESS);
      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.message || TOAST_MESSAGES.ORDER_UPDATE_ERROR);
    } finally {
      setLoadingStates((prev) => ({ ...prev, cancel: false }));
    }
  };

  // Utility function to clean up duplicate reviews
  const cleanupDuplicateReviews = (reviews, currentUserId) => {
    if (!reviews || !Array.isArray(reviews)) return reviews;
    
    // Remove duplicate reviews from the same user
    const seenUserIds = new Set();
    const cleanedReviews = reviews.filter(review => {
      const reviewUserId = review.userId || review.userEmail || review.userUsername;
      if (!reviewUserId) return true; // Keep reviews without userId for backward compatibility
      
      if (seenUserIds.has(reviewUserId)) {
        console.warn("Removing duplicate review:", review);
        return false;
      }
      
      // Check if this review belongs to the current user
      const isCurrentUserReview = 
        reviewUserId === currentUserId ||
        reviewUserId === userData?.id ||
        reviewUserId === userData?.email ||
        reviewUserId === userData?.username ||
        reviewUserId === getCookie("user");
      
      if (isCurrentUserReview) {
        seenUserIds.add(reviewUserId);
      }
      
      return true;
    });
    
    return cleanedReviews;
  };

  const handleReviewSubmit = async (reviewData) => {
    if (!order.documentId) {
      console.error("handleReviewSubmit: order.documentId is missing:", order);
      toast.error("Order ID is missing. Please try refreshing the page.");
      return;
    }

    if (!reviewData.dishId) {
      console.error("handleReviewSubmit: dishId is missing:", reviewData);
      toast.error("Dish ID is missing. Please try refreshing the page.");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, review: true }));

    try {
      // First, fetch the dish details to get the current reviews
      const dishResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${reviewData.dishId}?populate=*`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (!dishResponse.ok) {
        const errorText = await dishResponse.text();
        console.error("Failed to fetch dish details:", errorText);
        throw new Error("Failed to fetch dish details. Please try again.");
      }

      const dishData = await dishResponse.json();
      const currentDish = dishData.data;
      
      // Use utility function for consistent userId check
      const currentUserId = getCurrentUserId ? getCurrentUserId() : (userData?.id || userData?.email || userData?.username || getCookie("user"));
      
      if (!currentUserId) {
        throw new Error("Unable to identify user. Please refresh the page and try again.");
      }
      
      // Use utility function to check if user has already reviewed
      const userHasAlreadyReviewed = hasUserReviewedDish ? hasUserReviewedDish({ reviews: currentDish.reviews }) : 
        currentDish.reviews?.some(review => 
          review.userId === currentUserId || 
          review.userId === userData?.id ||
          review.userId === userData?.email ||
          review.userId === userData?.username ||
          review.userId === getCookie("user")
        );
      
      if (userHasAlreadyReviewed) {
        throw new Error("You have already reviewed this dish! Each dish can only be reviewed once.");
      }
      
      // Additional safety check: verify the review doesn't already exist in the database
      const existingReview = currentDish.reviews?.find(review => 
        review.userId === currentUserId || 
        review.userId === userData?.id ||
        review.userId === userData?.email ||
        review.userId === userData?.username ||
        review.userId === getCookie("user")
      );
      
      if (existingReview) {
        console.warn("Duplicate review detected in database:", existingReview);
        throw new Error("A review from you already exists for this dish. Please refresh the page.");
      }
      
      // Create the new review object with multiple userId identifiers for better tracking
      const newReview = {
        rating: reviewData.rating,
        text: reviewData.text,
        name: userData?.username || userData?.name || "Anonymous",
        createdAt: reviewData.createdAt,
        userId: currentUserId,
        userEmail: userData?.email || getCookie("user"),
        userUsername: userData?.username,
        orderId: order.documentId, // Track which order this review came from
        reviewDate: new Date().toISOString()
      };

      // Get existing reviews and add the new one
      const existingReviews = currentDish.reviews || [];
      
      // Clean up any existing duplicate reviews before adding new one
      const cleanedReviews = cleanupDuplicateReviews(existingReviews, currentUserId);
      
      // Check again after cleanup
      const stillHasUserReview = cleanedReviews.some(review => 
        review.userId === currentUserId || 
        review.userId === userData?.id ||
        review.userId === userData?.email ||
        review.userId === userData?.username ||
        review.userId === getCookie("user")
      );
      
      if (stillHasUserReview) {
        throw new Error("You have already reviewed this dish! Each dish can only be reviewed once.");
      }
      
      const updatedReviews = [...cleanedReviews, newReview];

      // Update the dish with the new review
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/dishes/${reviewData.dishId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            data: {
              reviews: updatedReviews
            }
          }),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error("Failed to update dish with review:", errorText);
        throw new Error("Failed to submit review. Please try again.");
      }

      // Update the local dish data to reflect the new review
      if (selectedDish) {
        const updatedDish = {
          ...selectedDish,
          reviews: [
            ...(selectedDish.reviews || []),
            newReview
          ]
        };
        setSelectedDish(updatedDish);
        
        // Also update the order dishes to reflect the new review
        if (order.dishes) {
          const updatedOrderDishes = order.dishes.map(dish => 
            dish.id === selectedDish.id ? updatedDish : dish
          );
          // You might need to update the order state here if you have it in local state
          console.log("Updated order dishes with new review:", updatedOrderDishes);
        }
      }

      toast.success("Review submitted successfully! Thank you for your feedback.");
      setIsReviewDialogOpen(false);
      
      // Refresh the order data to show the updated review status
      onStatusUpdate();
    } catch (error) {
      console.error("Error submitting review:", error);
      
      // Handle specific error cases
      if (error.message.includes("already reviewed") || error.message.includes("already exists")) {
        toast.error("You have already reviewed this dish!");
        setIsReviewDialogOpen(false);
        // Refresh to show updated review status
        onStatusUpdate();
      } else {
        toast.error(error.message || "Failed to submit review. Please try again.");
      }
    } finally {
      setLoadingStates((prev) => ({ ...prev, review: false }));
    }
  };

  const openReviewDialog = (dish) => {
    // Use utility function for validation
    if (validateReviewData && getDishReviewStatus) {
      const validation = validateReviewData(dish);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
      
      const reviewStatus = getDishReviewStatus(dish);
      if (reviewStatus.hasReviewed) {
        toast.info("You have already reviewed this dish! Each dish can only be reviewed once.");
        return;
      }
    } else {
      // Fallback to manual validation
      const currentUserId = getCurrentUserId ? getCurrentUserId() : (userData?.id || userData?.email || userData?.username || getCookie("user"));
      
      if (!currentUserId) {
        toast.error("Unable to identify user. Please refresh the page and try again.");
        return;
      }
      
      const userHasReviewed = hasUserReviewedDish ? hasUserReviewedDish(dish) : 
        dish.reviews?.some(review => 
          review.userId === currentUserId || 
          review.userId === userData?.id ||
          review.userId === userData?.email ||
          review.userId === userData?.username ||
          review.userId === getCookie("user")
        );
      
      if (userHasReviewed) {
        toast.info("You have already reviewed this dish! Each dish can only be reviewed once.");
        return;
      }
    }
    
    setSelectedDish(dish);
    setIsReviewDialogOpen(true);
  };

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="max-w-full w-[95vw] md:max-w-[900px] md:w-full p-0 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <AlertDialogTitle className="text-lg md:text-2xl font-semibold">
              Order Details
            </AlertDialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto flex flex-col md:flex-row p-4 gap-4">
            <CustomerDetails order={order} />
            <OrderItems 
              order={{...order, dishes: orderItems}} 
              onReviewClick={openReviewDialog} 
              userData={userData}
              getCurrentUserId={getCurrentUserId}
              hasUserReviewedDish={hasUserReviewedDish}
              validateReviewData={validateReviewData}
              getDishReviewStatus={getDishReviewStatus}
            />
          </div>
          
          <OrderActions
            order={order}
            loadingStates={loadingStates}
            onMarkAsReceived={handleMarkAsReceived}
            onCancelOrder={handleCancelOrder}
            userData={userData}
          />
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Dialog */}
      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        selectedDish={selectedDish}
        onSubmit={handleReviewSubmit}
        isLoading={loadingStates.review}
        userData={userData}
        getCurrentUserId={getCurrentUserId}
        hasUserReviewedDish={hasUserReviewedDish}
      />
    </>
  );
}

export default OrderDetailsDialog;
