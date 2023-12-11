import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.getSession();

  if (!data.session?.user?.id) throw new Error("No user ID");

  console.log(data.session);
  console.log(error);

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.getSession();

  if (!data.session?.user?.id) throw new Error("No user ID");

  const { data: designs, error: designsError } = await supabase.storage
    .from("user_uploads")
    .list(`${data.session?.user?.id}/`);

  const images = await Promise.all(
    designs!.map(async (design) => {
      if (design.name === "temp.png") return;
      const { data: image } = supabase.storage
        .from("user_uploads")
        .getPublicUrl(`${data.session?.user?.id}/${design.name}`);
      return image.publicUrl;
    })
  );

  images.pop();

  if (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
  return new Response(JSON.stringify({ images }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}
