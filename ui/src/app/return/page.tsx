"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function Page() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get("session_id");

    fetch(`/api/checkout_sessions?session_id=${sessionId}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
      });
  }, []);

  // if (status === "open") {
  //   return redirect("/");
  // }

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
              className="bg-accent hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
              onClick={() =>
                window.location.replace(
                  `mailto:support@chat2print.xyz?subject=Feedback&body=Hi, I just purchased a product from chat2print and wanted to share my experience with you.`
                )
              }
            >
              Share Feedback
            </button>
            <button
              className="text-accent bg-transparent hover:bg-accent hover:text-background font-bold py-2 px-4 rounded transition duration-300 ease-in-out border border-accent"
              onClick={() => window.location.replace("/")}
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
