import {
  ShoppingBag,
  Flame,
  Star,
  DollarSign,
  Sigma,
  Truck,
} from "lucide-react";
import { PiBowlFood } from "react-icons/pi";
import { getCookie } from "cookies-next";

function OrderItems({
  order,
  onReviewClick,
  userData,
  getCurrentUserId,
  hasUserReviewedDish,
  validateReviewData,
  getDishReviewStatus,
}) {
  // Add safety check for order
  if (!order) {
    console.warn("OrderItems: order prop is undefined");
    return (
      <div className="flex-1 min-w-0 max-w-full">
        <div className="text-center py-8 text-gray-500">
          <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Order data is missing</p>
        </div>
      </div>
    );
  }

  // Debug logging to see order structure

  return (
    <div className="flex-1 min-w-0 max-w-full">
      <h3 className="text-sm md:text-base font-semibold mb-4 md:mb-6 text-gray-700 flex items-center gap-2">
        <ShoppingBag className="w-4 h-4" />
        Items
      </h3>
      <div className="space-y-2 md:space-y-3 max-h-[220px] md:max-h-[340px] overflow-y-auto pr-1">
        {order.dishes && order.dishes.length > 0 ? (
          order.dishes.map((dish, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 md:gap-4 bg-gray-50 border border-gray-100 rounded-lg p-2 md:p-3"
            >
              <div className="w-16 md:w-20 relative rounded overflow-hidden flex-shrink-0 aspect-video">
                <img
                  src={dish.image?.url || "/fallback.png"}
                  alt={dish.name || "Dish"}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = "/fallback.png";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-xs text-gray-800">
                  {dish.name || "Unknown Dish"}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Quantity: {dish.quantity || 1}
                </div>

                {(dish.toppings?.length > 0 || dish.extras?.length > 0) && (
                  <div className="space-x-2 space-y-1 pt-2 border-t border-gray-100 flex items-start flex-col">
                    {dish.toppings && dish.toppings.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {dish.toppings.map((topping, idx) => (
                            <span
                              key={idx}
                              className="bg-pink-100 px-2 py-1 rounded-full text-pink-700 flex items-center justify-center gap-1 text-xs"
                            >
                              <img
                                src={"/toppings.png"}
                                alt="Topping"
                                className="w-3 h-3 scale-175"
                              />
                              {topping.name || "Topping"} ($
                              {topping.price || "0.00"})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {dish.extras && dish.extras.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-1">
                          {dish.extras.map((extra, idx) => (
                            <span
                              key={idx}
                              className="bg-emerald-100 px-2 py-1 rounded-full text-emerald-700 flex items-center justify-center gap-1 text-xs"
                            >
                              <img
                                src={"/extras.png"}
                                alt="Extra"
                                className="w-3 h-3 scale-125"
                              />
                              {extra.name || "Extra"} (${extra.price || "0.00"})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-orange-600">
                  $
                  {(
                    parseFloat(dish.total) ||
                    parseFloat(dish.basePrice) * (dish.quantity || 1) ||
                    0
                  ).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {dish.selectedSpiciness && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-xs text-gray-700">
                        {dish.selectedSpiciness}
                      </span>
                    </div>
                  )}
                </div>

                {order.orderStatus === "delivered" && (
                  <div className="flex items-center gap-2 mt-2">
                    {(() => {
                      // Use utility functions for consistent check
                      if (validateReviewData && getDishReviewStatus) {
                        const validation = validateReviewData(dish);
                        const reviewStatus = getDishReviewStatus(dish);

                        if (!validation.isValid || reviewStatus.hasReviewed) {
                          return (
                            <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                              <Star className="w-3 h-3 text-green-600" />
                              Already Reviewed
                            </div>
                          );
                        } else {
                          return (
                            <button
                              onClick={() => onReviewClick(dish)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                              type="button"
                            >
                              <Star className="w-3 h-3" />
                              Review
                            </button>
                          );
                        }
                      } else {
                        // Fallback to manual check
                        const currentUserId = getCurrentUserId
                          ? getCurrentUserId()
                          : userData?.id ||
                            userData?.email ||
                            userData?.username ||
                            getCookie("user");
                        const userHasReviewed = hasUserReviewedDish
                          ? hasUserReviewedDish(dish)
                          : dish.reviews?.some(
                              (review) =>
                                review.userId === currentUserId ||
                                review.userId === userData?.id ||
                                review.userId === userData?.email ||
                                review.userId === userData?.username ||
                                review.userId === getCookie("user")
                            );

                        if (userHasReviewed) {
                          return (
                            <div className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                              <Star className="w-3 h-3 text-green-600" />
                              Already Reviewed
                            </div>
                          );
                        } else {
                          return (
                            <button
                              onClick={() => onReviewClick(dish)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                              type="button"
                            >
                              <Star className="w-3 h-3" />
                              Review
                            </button>
                          );
                        }
                      }
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No items found</p>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            Total Items:
          </span>
          <span className="text-xs font-semibold text-gray-900">
            {Array.isArray(order.dishes)
              ? order.dishes.reduce(
                  (sum, dish) => sum + (parseInt(dish.quantity) || 1),
                  0
                )
              : 0}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Subtotal
          </span>
          <span className="text-xs font-semibold text-orange-600">
            ${order.subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            Delivery Fee
          </span>
          <span className="text-xs font-semibold text-orange-600">
            ${order.deliveryFee.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <Sigma className="w-3 h-3" />
            Tax
          </span>
          <span className="text-xs font-semibold text-orange-600">
            ${order.tax.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-gray-100">
          <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Total
          </span>
          <span className="text-xs font-semibold text-orange-600">
            ${order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderItems;
