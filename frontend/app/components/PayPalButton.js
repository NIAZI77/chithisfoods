// app/components/PayPalButton.jsx

"use client";

import { useEffect } from "react";

const PayPalButton = () => {
  useEffect(() => {
    // Dynamically load the PayPal SDK
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&components=buttons`;
    script.addEventListener("load", () => {
      // Initialize PayPal Buttons after the script is loaded
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: "100.00", // Example amount, replace with dynamic value
                  },
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              alert(
                `Transaction completed by ${details.payer.name.given_name}`
              );
            });
          },
          onError: (err) => {
            console.error("PayPal Error:", err);
          },
        })
        .render("#paypal-button-container");
    });
    document.body.appendChild(script);

    // Cleanup script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h3>PayPal Payment</h3>
      <div id="paypal-button-container"></div>
    </div>
  );
};

export default PayPalButton;
