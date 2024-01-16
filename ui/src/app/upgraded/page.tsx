"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/database.types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const supabase = createClientComponentClient<Database>();

export default function Page() {
  const [status, setStatus] = useState<string>("loading");
  const [tier, setTier] = useState<string>("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tierr = urlParams.get("tier");
    const id = urlParams.get("session_id");

    if (!id || !tierr) {
      setStatus("creds");
      return;
    }

    if (tierr !== "basic" && tierr !== "premium" && tierr !== "pro") {
      setStatus("wrong-tier");
      return;
    }

    async function load() {
      const { data, error } = await supabase.auth.getUser();
      const { error: insertError } = await supabase.from("upgrades").insert({
        // @ts-ignore
        id,
        tier: tierr,
        user_id: data.user?.id,
      });

      if (error) {
        console.log("fetching user Error: ", error);
      }

      if (insertError) {
        console.log("inserting upgrade Error: ", insertError);
      }
      setStatus("success");
    }
    load();
    setTier(tierr!);
  }, []);

  if (status === "loading")
    return (
      <div className="flex flex-col text-accent items-center justify-center py-2">
        <h2 className="text-2xl font-bold">Loading...</h2>
      </div>
    );

  const TierFeature = ({
    features,
    tierName,
  }: {
    features: string[];
    tierName: string;
  }) => {
    const containerVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
    };

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md w-full text-accent bg-background shadow-xl rounded-lg p-4 m-4"
      >
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
        <h3 className="text-xl m-2 font-bold text-center">{tierName} Tier</h3>
        <ol className="list-disc space-y-2 text-center p-4">
          {features?.map((feature) => (
            <li key={feature} className="text-sm">
              {feature}
            </li>
          ))}
        </ol>
      </motion.div>
    );
  };

  const tiers = {
    basic: {
      name: "Basic",
      features: [
        "No Enhancement Storage",
        "10 Daily Enhancements",
        "10 Daily Mockups",
      ],
      price: "£1",
    },
    premium: {
      name: "Premium",
      features: [
        "500MB Enhancement Storage",
        "Uncapped Daily Mockups",
        "25 Daily Enhancements",
        "10% Product Discount",
      ],
      price: "£10",
    },
    pro: {
      name: "Pro",
      features: [
        "2.5GB Enhancement Storage",
        "Uncapped Usage Limits",
        "25% Product Discount",
      ],
      price: "£25",
    },
  };

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1, duration: 0.3 } },
  };

  if (status === "loading") {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={loadingVariants}
        className="flex flex-col text-accent items-center justify-center py-2"
      >
        <h2 className="text-2xl font-bold">Loading...</h2>
      </motion.div>
    );
  }

  if (status === "success") {
    // @ts-ignore
    const selectedTier = tiers[tier];
    return (
      <div className="flex flex-col gradientBG m-4 p-4 items-center justify-center">
        <h2 className="text-2xl font-bold text-accent">
          Thank you for your support!
        </h2>
        <TierFeature
          features={selectedTier?.features}
          tierName={selectedTier?.name}
        />
        <p className="text-accent mt-4">
          Your support enables us to keep improving.
        </p>
        <p className="text-accent mt-4">
          Enjoy your {selectedTier?.name} Tier benefits!
        </p>

        <Button
          className="mt-4 text-accent bg-background border-accent hover:bg-accent hover:text-background"
          onClick={() => (window.location.href = "/studio")}
        >
          Go to the Studio
        </Button>
      </div>
    );
  }

  if (status === "creds") {
    return (
      <div className="flex flex-col gradientBG m-4 p-4 max-w-2xl items-center justify-center">
        <h2 className="text-2xl font-bold text-accent">
          There was an error processing your payment.
        </h2>
        <p className="text-accent mt-4 text-center">
          Please contact us at{" "}
          <a
            className="text-accent underline"
            href="mailto:support@chat2print.xyz"
          >
            support@chat2print.xyz
          </a>{" "}
          to ensure your payment was processed correctly.
        </p>
        <p className="text-gray-500 mt-4 text-center text-sm">Error Code: C0</p>
      </div>
    );
  }

  if (status === "wrong-tier") {
    return (
      <div className="flex flex-col gradientBG m-4 p-4 max-w-2xl items-center justify-center">
        <h2 className="text-2xl font-bold text-accent">
          There was an error processing your payment.
        </h2>
        <p className="text-accent mt-4 text-center">
          Please contact us at{" "}
          <a
            className="text-accent underline"
            href="mailto:support@chat2print.xyz"
          >
            support@chat2print.xyz
          </a>{" "}
          to ensure your payment was processed correctly.
        </p>
        <p className="text-gray-500 mt-4 text-center text-sm">Error Code: T0</p>
      </div>
    );
  }

  return window.location.replace("/studio");
}
