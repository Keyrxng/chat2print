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

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.session.user.id)
    .single();

  if (userError) {
    return new Response(JSON.stringify(userError), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  let upscaledImages = [] as string[] | undefined;
  const { data: upscaleBucketPaths, error: upBucketPathError } = await supabase
    .from("upscales")
    .select("bucket_path")
    .eq("user_id", data.session.user.id)
    .limit(10)
    .order("created_at", { ascending: true });

  if (user.tier !== "free") {
    upscaledImages = upscaleBucketPaths?.map((upscale) => {
      const bucketPath = upscale.bucket_path;
      return `${process.env.SUPABASE_URL}/storage/v1/object/public/user_uploads/${bucketPath}`;
    });
  }

  const { data: designs, error: designError } = await supabase.rpc(
    "list_objects",
    {
      bucketid: "user_uploads",
      prefix: `${data.session?.user?.id}`,
      limits: 10,
      offsets: 0,
    }
  );

  const images = await Promise.all(
    designs!.map(async (design) => {
      if (design.name === "temp.png") return;
      if (design.name === "upscaled") return;
      if (design.name === null || design.name === undefined) return;
      if (
        // @ts-ignore
        design.metadata?.mimetype !== "image/webp" ||
        // @ts-ignore
        design.metadata?.mimetype !== "image/png"
      )
        return;
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/user_uploads/${design.name}`;
      return url;
    })
  );

  const filteredImages = images.filter(
    (image) => image !== undefined && image !== null
  );

  if (designError || upBucketPathError) {
    return new Response(
      JSON.stringify({ authError: error, designError, upBucketPathError }),
      {
        status: 500,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  return new Response(
    JSON.stringify({
      designImages: filteredImages,
      upscaledImages: upscaledImages,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
