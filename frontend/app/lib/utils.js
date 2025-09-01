import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Cart utility functions
export const updateCartAndNotify = (cartData) => {
  localStorage.setItem("cart", JSON.stringify(cartData));
  window.dispatchEvent(new CustomEvent("cartUpdate"));
};

export const getCartItemCount = (cart) => {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum, vendorGroup) => {
    return (
      sum +
      vendorGroup.dishes.reduce((dishSum, dish) => dishSum + dish.quantity, 0)
    );
  }, 0);
};
