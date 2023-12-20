import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import type { Database } from "@/lib/database.types";

export async function POST() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>(
    {
      cookies: () => cookieStore,
    },
    {
      options: {
        global: {
          headers: {
            "cache-control": "public, max-age=604800",
          },
        },
      },
    }
  );

  const { data, error } = await supabase.auth.getSession();

  if (!data.session?.user?.id) throw new Error("No user ID");

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

export async function GET() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const { data, error } = await supabase.auth.getSession();

  if (!data.session?.user?.id)
    return new Response(JSON.stringify(null), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });

  const { data: designs, error: designError } = await supabase.rpc(
    "list_objects",
    {
      bucketid: "user_uploads",
      prefix: `${data.session?.user?.id}`,
      limits: 10,
      offsets: 0,
    },
    { headers: { "cache-control": "public, max-age=604800" } }
  );

  const { data: upscales, error: upscalesError } = await supabase.rpc(
    "list_objects",
    {
      bucketid: "user_uploads",
      prefix: `${data.session?.user?.id}/upscaled/`,
      limits: 10,
      offsets: 0,
    },
    { headers: { "cache-control": "public, max-age=604800" } }
  );

  const upscaledImages = await Promise.all(
    upscales!.map(async (upscale) => {
      if (upscale.name === "temp.png") return;
      if (upscale.name === "upscaled") return;
      if (upscale.name === null || upscale.name === undefined) return;

      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/user_uploads/${upscale.name}`;
      return url;
    })
  );

  const images = await Promise.all(
    designs!.map(async (design) => {
      if (design.name === "temp.png") return;
      if (design.name === "upscaled") return;
      if (design.name === null || design.name === undefined) return;
      if (design.metadata.mimetype !== "image/webp") return;
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/user_uploads/${design.name}`;
      return url;
    })
  );

  const filteredImages = images.filter(
    (image) => image !== undefined && image !== null
  );
  const filteredUpscaledImages = upscaledImages.filter(
    (image) => image !== undefined && image !== null
  );

  if (designError || upscalesError) {
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  return new Response(
    JSON.stringify({
      designImages: filteredImages,
      upscaledImages: filteredUpscaledImages,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
