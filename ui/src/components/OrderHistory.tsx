"use client";
import { Calendar, DollarSign, LucidePackageOpen } from "lucide-react";
import OrderDetail from "./OrderDetails";
import React, { useState } from "react";
import { Button } from "./ui/button";

const orders = [
  {
    id: 1,
    date: "2021-01-01",
    total: 19.99,
  },
  {
    id: 2,
    date: "2021-01-02",
    total: 24.99,
  },
  {
    id: 3,
    date: "2021-01-03",
    total: 29.99,
  },
];

export default function OrderHistory() {
  const [viewingOrder, setViewingOrder] = useState(false);
  const [order, setOrder] = useState(null);

  const handleClick = (order) => {
    setOrder(order);
    setViewingOrder(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-accent font-bold mb-4">Order History</h2>
      {!viewingOrder && (
        <>
          {orders.length === 0 ? (
            <div className="text-center p-10 rounded-md shadow-lg bg-gray-100">
              <LucidePackageOpen className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-600">
                You haven&apos;t placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border bg-white p-4 rounded-md shadow transition duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LucidePackageOpen className="text-accent text-3xl mr-4" />
                      <div>
                        <p className="text-lg font-semibold">
                          Order #{order.id}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <Calendar className="mr-2" />
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                        <p className="flex items-center text-gray-600">
                          <DollarSign className="mr-2" />$
                          {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleClick(order)}
                      className="text-accent hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {viewingOrder && (
        <>
          <OrderDetail orderId={order.id} />
          <Button
            onClick={() => setViewingOrder(false)}
            className="text-accent w-full"
          >
            Go Back
          </Button>
        </>
      )}
    </div>
  );
}
