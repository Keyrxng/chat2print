import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";
export const runtime = "edge";

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

export async function POST(req: any, res: any) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data: session, error } = await supabase.auth.getSession();

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  if (!session.session?.user?.id) throw new Error("No user ID");

  let keyToUse = "";

  if (session.session?.user?.id) {
    const { data: uak, error } = await supabase
      .from("uak")
      .select("*")
      .eq("user_id", session.session.user.id)
      .single();

    if (uak?.ak && !error) {
      keyToUse = uak.ak;
    }
  }

  const { prompt, quality, dimension, style } = await req.json();

  const apiUrl = "https://api.openai.com/v1/images/generations";

  console.log("prompt: ", prompt);
  console.log("quality: ", quality);
  console.log("dimension: ", dimension);
  console.log("style: ", style);
  console.log("keyToUse: ", keyToUse);

  const layout = layouts.find((layout) => layout.name === dimension);
  let respo;
  let token: string | undefined = undefined;

  if (!keyToUse) {
    const { data: user } = await supabase
      .from("users")
      .select("tier")
      .eq("id", session.session?.user.id)
      .single();

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    if (user.tier === "free") {
      return new Response(
        JSON.stringify({
          error:
            "You are on the free tier. Please upgrade to use this feature.",
        }),
        {
          status: 403,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }

    if (user.tier === "premium" || user.tier === "pro") {
      token = process.env.OPENAI_API_KEY;
    }
  } else {
    token = keyToUse;
  }

  if (!token) {
    return new Response(
      JSON.stringify({
        error: "You are on the free tier. Please upgrade to use this feature.",
      }),
      {
        status: 403,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  } catch (err: any) {
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
}
