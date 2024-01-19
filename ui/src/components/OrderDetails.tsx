import { Calendar, CreditCard, InfoIcon, Ship } from "lucide-react";
import React from "react";
interface Order {
  user_id: string | null;
  items: [
    {
      files: [
        {
          url: number;
        }
      ];
      quantity: number;
      variant_id: number;
    }
  ];
  retail_costs: {
    subtotal: number;
  };
  created_at: string;
  task_key: string;
  completed: boolean;
  final: {
    id: string;
    vat: number;
    name: string;
    rate: string;
    total: number;
    shipping: number;
    subtotal: number;
    maxDeliveryDate: string;
    maxDeliveryDays: number;
    minDeliveryDays: number;
  };
  product: string;
  paid: null;
}
export default function OrderDetail({ order }: { order: Order | null }) {
  return (
    <div className="container text-gray-500 mx-auto p-4">
      <h2 className="text-2xl text-accent font-bold mb-4">Order Details</h2>
      <div className="border p-4 rounded shadow-md bg-zinc-950">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-lg text-accent font-medium">
              Order #{order?.task_key}
            </p>
            <p className="flex items-center text-gray-500">
              <Calendar className="mr-2" />
              {order?.created_at &&
                new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center">
            <InfoIcon className="text-lg text-accent mr-2" />
            <span className="text-lg">{order?.completed}</span>
          </div>
        </div>
        <div className="mb-4 text-sm ">
          {order?.items.map((item, index) => (
            <div
              key={item.variant_id}
              className="grid   grid-cols-1 sm:grid-cols-3 gap-4 mb-2"
            >
              <span className="font-semibold   w-fit">{order?.product}</span>
              <span>Qty: {item.quantity}</span>
              <span>
                £{(item.quantity * order?.retail_costs.subtotal).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t pt-4 mt-4">
          <div className="flex items-center">
            <CreditCard className="text-accent mr-2" />
            <span className="text-lg font-semibold">Total Paid:</span>
          </div>
          <span className="text-lg">£{order?.final.total}</span>
        </div>
        {order?.completed === true && (
          <div className="mt-4 flex items-center">
            <Ship className="text-accent mr-2" />
            <span>Your order is on its way!</span>
          </div>
        )}
      </div>
    </div>
  );
}
