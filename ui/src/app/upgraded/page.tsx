"use client";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
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
    const tier = urlParams.get("tier");
    const id = urlParams.get("id");
    console.log(tier);
    console.log("checkout id: ", id);
    async function load() {
      const { data, error } = await supabase.auth.getUser();
      const { data: session, error: sessionError } =
        await supabase.auth.getSession();
      console.log("SESSION: ", session);
      console.log("SESSION ERROR: ", sessionError);
      console.log("DATA: ", data);
      console.log("EREERE: ", error);
    }
    load();
  }, []);

  return (
    <div className="flex flex-col text-accent items-center justify-center min-h-screen py-2">
      <h2 className="text-2xl font-bold">Thank you for your support!</h2>
    </div>
  );
}
