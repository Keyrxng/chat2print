"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";

const supabase = createClientComponentClient<Database>();

export default function Page() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);

        async function getDB() {
          const { data: customerData, error: customerError } =
            await supabase.auth.getUser();

          return customerData.user;
        }

        const dbData = {
          customer_details: data.customer_details,
          shipping_details: data.shipping_details,
          payment_intent: data.payment_intent,
          payment_total: data.amount_total,
          payment_status: data.payment_status,
          status: data.status,
        };

        async function setDB() {
          const user = await getDB();
          const { data: insertData, error } = await supabase
            .from("sales")
            .insert({
              id: data.id,
              sale_info: dbData,
              user_id: user?.id,
            });
        }
        setDB();
      });
  }, []);

  if (status === "complete") {
    return (
      <div className="flex flex-col items-center justify-center gradientBG p-4">
        <Image
          src="/c2plogo.png"
          width={200}
          height={200}
          alt="chat2print logo"
        />
        <div className="max-w-lg w-full bg-background text-accent rounded-lg shadow-md p-8 my-4">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-6">
            Thank You For Your Purchase!
          </h2>
          <p className="text-center mb-6">
            A confirmation email is on its way to you.
            <hr className="my-4" />
            Your feedback is invaluable to us and helps improve our service more
            than anything else. Please consider sharing your experience with us
            on X!
          </p>
          <div className="flex flex-col space-y-4">
            <button
              className="text-accent bg-transparent hover:bg-accent hover:text-background font-bold py-2 px-4 rounded transition duration-300 ease-in-out border border-accent"
              onClick={() => window.location.replace("/studio")}
            >
              Return to the Studio
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
