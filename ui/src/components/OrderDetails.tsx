import { Calendar, CreditCard, InfoIcon, Ship } from "lucide-react";
import React from "react";

// Mock data for order details
const orderDetails = {
  id: 1,
  date: "2021-01-01",
  total: 19.99,
  items: [
    {
      name: "Custom T-Shirt",
      quantity: 2,
      pricePerItem: 9.99,
    },
    {
      name: "Custom Mug",
      quantity: 1,
      pricePerItem: 12.99,
    },
    // ... more items
  ],
  status: "Shipped",
};

export default function OrderDetail({ orderId }: { orderId: number }) {
  const order = orderDetails;
  const noop = () => {
    return orderId;
  };
  noop();

  return (
    <div className="container text-gray-500 mx-auto p-4">
      <h2 className="text-2xl text-accent font-bold mb-4">Order Details</h2>
      <div className="border p-4 rounded shadow-md bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-lg text-accent font-medium">Order #{order.id}</p>
            <p className="flex items-center text-gray-500">
              <Calendar className="mr-2" />
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center">
            <InfoIcon className="text-lg text-accent mr-2" />
            <span className="text-lg">{order.status}</span>
          </div>
        </div>
        <div className="mb-4 text-sm ">
          {order.items.map((item, index) => (
            <div
              key={item.name}
              className="grid   grid-cols-1 sm:grid-cols-3 gap-4 mb-2"
            >
              <span className="font-semibold   w-fit">{item.name}</span>
              <span>Qty: {item.quantity}</span>
              <span>${(item.quantity * item.pricePerItem).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center">
            <CreditCard className="text-accent mr-2" />
            <span className="text-lg font-semibold">Total Paid:</span>
          </div>
          <span className="text-lg">${order.total.toFixed(2)}</span>
        </div>
        {order.status === "Shipped" && (
          <div className="mt-4 flex items-center">
            <Ship className="text-accent mr-2" />
            <span>Your order is on its way!</span>
          </div>
        )}
      </div>
    </div>
  );
}
