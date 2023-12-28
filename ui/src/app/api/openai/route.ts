import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

export async function POST(req, res) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  if (!data.session?.user?.id) throw new Error("No user ID");

  const apiUrl = "https://api.openai.com/v1/images/generations";
  const apiKey = process.env.OPENAI_API_KEY;

  const { prompt, quality, dimension, style } = await req.json();

  console.log("prompt: ", prompt);
  console.log("quality: ", quality);
  console.log("dimension: ", dimension);

  // 1024x1024, 1024x1792 or 1792x1024 pixels.
  const layouts = [
    {
      name: "Portrait",
      size: "1024x1792",
    },
    {
      name: "Landscape",
      size: "1792x1024",
    },
    {
      name: "Square",
      size: "1024x1024",
    },
  ];

  const layout = layouts.find((layout) => layout.name === dimension);
  let respo;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        size: layout?.size,
        style: style.toLowerCase(),
        quality: quality.toLowerCase(),
        response_format: "b64_json",
        n: 1,
      }),
    });

    respo = await response.json();
  } catch (err) {
    if (err.response) {
      console.log("err.response: ", err.response.status);
      console.log("err.response: ", err.response.data);
      return new Response(JSON.stringify({ response: err.response.data }), {
        status: err.response.status,
        headers: {
          "content-type": "application/json",
        },
      });
    } else {
      console.log("err: ", err.message);
      return new Response(JSON.stringify({ response: err.message }), {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      });
    }
  }

  return new Response(JSON.stringify({ response: respo }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });

  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${apiKey}`,
  //     },
  //     body: JSON.stringify({
  //       prompt: prompt,
  //     }),
  //   });

  //   const imgData = await response.json();

  //   console.log("image gen imgData: ", imgData);

  //   return new Response(JSON.stringify({ imgData }), {
  //     status: 200,
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //   });
}

export async function GET() {}
