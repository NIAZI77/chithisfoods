import React from 'react';

// Sample order data based on your provided JSON structure
const mockOrders = [
  {
    order_id: "abc123",
    customer_id: "user987",
    cart_items: [
      {
        item_id: "9876",
        item_name: "Chicken Alfredo",
        item_description: "Creamy Alfredo sauce with grilled chicken over pasta.",
        price: 15.99,
        currency: "USD",
        quantity: 2,
        total_price: 31.98,
        nutrition_info: {
          calories: 800,
          protein: "45g",
          carbs: "60g",
          fat: "30g"
        },
        image_url: "https://example.com/images/chicken-alfredo.jpg",
        availability: "available",
        special_instructions: "No garlic, please.",
        item_subtotal: 31.98
      }
    ],
    cart_total: {
      subtotal: 31.98,
      delivery_fee: 4.99,
      total_price: 36.97,
      tax: 3.00
    },
    delivery_options: {
      selected_delivery_type: "Local Delivery",
      delivery_fee: 4.99,
      estimated_delivery_time: "30-45 minutes"
    },
    billing_info: {
      shipping_address: {
        street: "1234 Market St",
        city: "San Francisco",
        state: "CA",
        zipcode: "94110",
        country: "USA"
      },
      payment_method: "Credit Card"
    },
    order_summary: {
      item_count: 2,
      total_items: 2,
      total_price: 36.97
    }
  },
  {
    order_id: "ab123",
    customer_id: "user987",
    cart_items: [
      {
        item_id: "9876",
        item_name: "Chicken Alfredo",
        item_description: "Creamy Alfredo sauce with grilled chicken over pasta.",
        price: 15.99,
        currency: "USD",
        quantity: 2,
        total_price: 31.98,
        nutrition_info: {
          calories: 800,
          protein: "45g",
          carbs: "60g",
          fat: "30g"
        },
        image_url: "https://example.com/images/chicken-alfredo.jpg",
        availability: "available",
        special_instructions: "No garlic, please.",
        item_subtotal: 31.98
      }
    ],
    cart_total: {
      subtotal: 31.98,
      delivery_fee: 4.99,
      total_price: 36.97,
      tax: 3.00
    },
    delivery_options: {
      selected_delivery_type: "Local Delivery",
      delivery_fee: 4.99,
      estimated_delivery_time: "30-45 minutes"
    },
    billing_info: {
      shipping_address: {
        street: "1234 Market St",
        city: "San Francisco",
        state: "CA",
        zipcode: "94110",
        country: "USA"
      },
      payment_method: "Credit Card"
    },
    order_summary: {
      item_count: 2,
      total_items: 2,
      total_price: 36.97
    }
  },
  {
    order_id: "abc12",
    customer_id: "user987",
    cart_items: [
      {
        item_id: "9876",
        item_name: "Chicken Alfredo",
        item_description: "Creamy Alfredo sauce with grilled chicken over pasta.",
        price: 15.99,
        currency: "USD",
        quantity: 2,
        total_price: 31.98,
        nutrition_info: {
          calories: 800,
          protein: "45g",
          carbs: "60g",
          fat: "30g"
        },
        image_url: "https://example.com/images/chicken-alfredo.jpg",
        availability: "available",
        special_instructions: "No garlic, please.",
        item_subtotal: 31.98
      }
    ],
    cart_total: {
      subtotal: 31.98,
      delivery_fee: 4.99,
      total_price: 36.97,
      tax: 3.00
    },
    delivery_options: {
      selected_delivery_type: "Local Delivery",
      delivery_fee: 4.99,
      estimated_delivery_time: "30-45 minutes"
    },
    billing_info: {
      shipping_address: {
        street: "1234 Market St",
        city: "San Francisco",
        state: "CA",
        zipcode: "94110",
        country: "USA"
      },
      payment_method: "Credit Card"
    },
    order_summary: {
      item_count: 2,
      total_items: 2,
      total_price: 36.97
    }
  },
];

const OrderHistory = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Order History</h1>

      {/* Loop through orders */}
      {mockOrders.map((order) => (
        <div key={order.order_id} className="bg-orange-50 shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
              <p className="text-sm text-orange-500">Customer ID: {order.customer_id}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-orange-700">Total: ${order.cart_total.total_price.toFixed(2)}</p>
              <p className="text-sm text-orange-500">Items: {order.order_summary.item_count}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h3 className="text-lg font-medium">Order Items</h3>
            {order.cart_items.map((item) => (
              <div key={item.item_id} className="flex items-center space-x-4 mt-4">
                <img src={item.image_url} alt={item.item_name} className="w-24 h-24 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.item_name}</h4>
                  <p className="text-sm text-orange-600">{item.item_description}</p>
                  <p className="text-sm text-orange-500">Special Instructions: {item.special_instructions}</p>
                  <div className="mt-2 text-sm text-orange-500">
                    <p>Quantity: {item.quantity}</p>
                    <p>Price per Item: ${item.price.toFixed(2)}</p>
                    <p>Item Total: ${item.item_subtotal.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 text-sm text-orange-600">
                    <p>Calories: {item.nutrition_info.calories} | Protein: {item.nutrition_info.protein}</p>
                    <p>Carbs: {item.nutrition_info.carbs} | Fat: {item.nutrition_info.fat}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Information */}
          <div className="mb-4">
            <h3 className="text-lg font-medium">Delivery Information</h3>
            <p className="text-sm text-orange-600">Delivery Type: {order.delivery_options.selected_delivery_type}</p>
            <p className="text-sm text-orange-600">Delivery Fee: ${order.cart_total.delivery_fee.toFixed(2)}</p>
            <p className="text-sm text-orange-600">Estimated Delivery Time: {order.delivery_options.estimated_delivery_time}</p>
          </div>

          {/* Billing Information */}
          <div className="mb-4">
            <h3 className="text-lg font-medium">Billing Information</h3>
            <p className="text-sm text-orange-600">Payment Method: {order.billing_info.payment_method}</p>
            <div className="text-sm text-orange-600">
              <p>{order.billing_info.shipping_address.street}</p>
              <p>{order.billing_info.shipping_address.city}, {order.billing_info.shipping_address.state} {order.billing_info.shipping_address.zipcode}</p>
              <p>{order.billing_info.shipping_address.country}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-orange-100 p-4 rounded-lg mt-6">
            <h3 className="text-lg font-medium">Order Summary</h3>
            <div className="flex justify-between text-sm text-orange-700">
              <p>Item Count: {order.order_summary.item_count}</p>
              <p>Subtotal: ${order.cart_total.subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm text-orange-700">
              <p>Tax: ${order.cart_total.tax.toFixed(2)}</p>
              <p>Delivery Fee: ${order.cart_total.delivery_fee.toFixed(2)}</p>
            </div>
            <div className="mt-2 text-lg font-semibold text-orange-900">
              <p>Total Price: ${order.cart_total.total_price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
