"use client";
import {
  Calendar,
  DollarSign,
  LucidePackageOpen,
  LucideTrainTrack,
  PoundSterling,
  Spline,
  Truck,
  Vegan,
} from "lucide-react";
import OrderDetail from "./OrderDetails";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database, Json } from "@/lib/database.types";

const supabase = createClientComponentClient<Database>();

interface Order {
  created_at: string;
  items: Json;
  retail_costs: Json;
  task_key: string;
  user_id: string | null;
}

export default function OrderHistory() {
  const [viewingOrder, setViewingOrder] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>();

  useEffect(() => {
    async function fetchOrders() {
      const { data: user, error } = await supabase.auth.getUser();
      if (!user) return console.error(error);
      const { data: orders, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.user!.id);
      if (!orders) return console.error(fetchError);
      console.log("orders", orders);
      setOrders(orders);
      return orders;
    }

    const orderz = fetchOrders();
  }, []);

  const handleClick = (order: any) => {
    setActiveOrder(order);
    setViewingOrder(true);
    console.log("order", order);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-accent font-bold mb-4">Order History</h2>
      {!viewingOrder && (
        <>
          {orders?.length === 0 ? (
            <div className="text-center p-10 rounded-md shadow-lg bg-gray-100">
              <LucidePackageOpen className="mx-auto text-6xl text-gray-400 mb-4" />
              <p className="text-gray-600">
                You haven&apos;t placed any orders yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm ">
              {orders?.map((order) => (
                <div
                  key={order.task_key}
                  className="border bg-zinc-950  p-4 rounded-md shadow transition duration-300 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LucidePackageOpen className="text-accent text-3xl mr-4" />
                      <div>
                        <p className="text-lg text-accent  font-medium">
                          {order.task_key.toLocaleUpperCase()}
                        </p>
                        <div className="flex gap-4">
                          <p className="flex items-center text-gray-500">
                            <Calendar className="mr-2" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="flex items-center text-gray-500">
                            <Truck className="mr-1" />
                            {order.items.files?.quantity}
                          </p>
                          <p className="flex items-center text-gray-500">
                            <PoundSterling />
                            {order.retail_costs?.subtotal}
                          </p>
                        </div>
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
          <OrderDetail orderId={Number(activeOrder?.task_key.slice(3))} />
          <Button
            onClick={() => setViewingOrder(false)}
            className="text-accent w-full hover:bg-accent hover:text-background transition duration-300 border  border-accent"
          >
            Go Back
          </Button>
        </>
      )}
    </div>
  );
}
